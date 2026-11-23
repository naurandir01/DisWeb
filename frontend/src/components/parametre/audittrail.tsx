// frontend/src/components/parametre/audittrail.tsx
'use client'
import * as React from 'react';
import API, { AuditEntry } from '../api/api';
import useIsAdmin from '../api/useIsAdmin';
import { PageContainer } from '@toolpad/core';
import {
    Alert, Autocomplete, Card, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { History, Security, Storage, Tune, BugReport, Description, Extension } from '@mui/icons-material';

// Icon per audit action family (visual scanning of the trail)
const ACTION_ICONS: Record<string, React.ReactNode> = {
    CASE_CREATE: <Description fontSize="small" />,
    CASE_DELETE: <Description fontSize="small" color="error" />,
    SOURCE_CREATE: <Storage fontSize="small" />,
    SOURCE_DELETE: <Storage fontSize="small" color="error" />,
    SOURCE_HASH_VERIFY: <Security fontSize="small" />,
    FILE_ACCESS: <Description fontSize="small" />,
    HEXDUMP_ACCESS: <Description fontSize="small" />,
    REGISTRY_ACCESS: <Storage fontSize="small" />,
    TASK_LAUNCH: <Tune fontSize="small" />,
    IOC_CREATE: <BugReport fontSize="small" />,
    IOC_DELETE: <BugReport fontSize="small" color="error" />,
    YARA_CREATE: <Extension fontSize="small" />,
    YARA_DELETE: <Extension fontSize="small" color="error" />,
    PROFILE_ROLE_CHANGE: <History fontSize="small" />,
    INTEGRITY_SETTING_CHANGE: <Security fontSize="small" />,
};

const ACTIONS = Object.keys(ACTION_ICONS);

// Row highlight heuristic: destructive or integrity-mismatch actions stand out
function isErrorRow(entry: AuditEntry): boolean {
    if (entry.action.endsWith('_DELETE')) return true;
    if (entry.action === 'SOURCE_HASH_VERIFY' && entry.detail?.status === 'MISMATCH') return true;
    return false;
}

export default function AuditTrail() {
    const [isAdmin] = useIsAdmin();

    // Filters
    const [actionFilter, setActionFilter] = React.useState<string | null>(null);
    const [userFilter, setUserFilter] = React.useState<string>('');
    const [targetFilter, setTargetFilter] = React.useState<string>('');
    const [pageSize, setPageSize] = React.useState<number>(50);

    const [entries, setEntries] = React.useState<AuditEntry[]>([]);
    const [users, setUsers] = React.useState<string[]>([]);
    const [error, setError] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const loadEntries = React.useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const params = new URLSearchParams({ limit: String(pageSize) });
            if (actionFilter) params.set('action', actionFilter);
            if (userFilter) params.set('user', userFilter);
            if (targetFilter) params.set('target', targetFilter);
            const res = await API.get(`/audit/?${params.toString()}`);
            setEntries(res.data ?? []);
        } catch {
            setError('Failed to load the audit trail.');
        } finally {
            setIsLoading(false);
        }
    }, [actionFilter, userFilter, targetFilter, pageSize]);

    React.useEffect(() => {
        loadEntries();
    }, [loadEntries]);

    // Populate the user filter list (admins only can list all users)
    React.useEffect(() => {
        (async () => {
            try {
                const res = await API.get('/users/');
                setUsers(res.data.map((p: any) => p.username));
            } catch {
                setUsers([]);
            }
        })();
    }, []);

    const columns: GridColDef[] = [
        {
            field: 'timestamp', headerName: 'Date', flex: 1, minWidth: 170,
            valueFormatter: (value) => new Date(value as string).toLocaleString(),
        },
        {
            field: 'action', headerName: 'Action', width: 230,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    {ACTION_ICONS[params.row.action] ?? <History fontSize="small" />}
                    <Typography variant="caption">{params.row.action}</Typography>
                </Stack>
            ),
        },
        { field: 'user', headerName: 'User', width: 130 },
        { field: 'ip', headerName: 'IP', width: 130 },
        { field: 'target', headerName: 'Target', flex: 1, minWidth: 200 },
        {
            field: 'detail', headerName: 'Detail', flex: 1.5, minWidth: 220,
            renderCell: (params) => (
                <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
                    {params.row.detail ? JSON.stringify(params.row.detail) : '-'}
                </Typography>
            ),
        },
    ];

    return (
        <PageContainer>
            <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <History />
                    <Typography variant="h6">Audit Trail — chain of custody</Typography>
                </Stack>

                {!isAdmin && (
                    <Alert severity="info">
                        You are viewing only your own audit entries. The administrator
                        sees the full trail of every user.
                    </Alert>
                )}

                {/* Filters */}
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap alignItems="center">
                    <Autocomplete
                        disablePortal
                        options={ACTIONS}
                        value={actionFilter}
                        onChange={(_e, v) => setActionFilter(v)}
                        sx={{ width: 280 }}
                        renderInput={(params) => <TextField {...params} label="Action" size="small" />}
                    />
                    <Autocomplete
                        disablePortal
                        options={users}
                        value={userFilter || null}
                        onChange={(_e, v) => setUserFilter(v ?? '')}
                        sx={{ width: 200 }}
                        renderInput={(params) => <TextField {...params} label="User" size="small" />}
                    />
                    <TextField
                        label="Target contains"
                        size="small"
                        sx={{ width: 260 }}
                        value={targetFilter}
                        onChange={(e) => setTargetFilter(e.target.value)}
                    />
                    <ToggleButtonGroup
                        exclusive
                        value={pageSize}
                        onChange={(_e, v) => v && setPageSize(v)}
                        size="small"
                    >
                        {[50, 100, 500, 1000].map((n) => (
                            <ToggleButton key={n} value={n}>{n}</ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Stack>

                {error && <Alert severity="warning">{error}</Alert>}

                <Card sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={entries}
                        columns={columns}
                        getRowId={(row) => row.timestamp + row.action + row.target}
                        loading={isLoading}
                        getRowClassName={(params) =>
                            isErrorRow(params.row) ? 'audit-row-error' : ''
                        }
                        sx={{
                            '& .audit-row-error': { backgroundColor: 'rgba(255,0,0,0.06)' },
                        }}
                        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                        showToolbar
                    />
                </Card>
            </Stack>
        </PageContainer>
    );
}
