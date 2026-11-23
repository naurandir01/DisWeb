// frontend/src/components/parametre/integritysettings.tsx
'use client'
import * as React from 'react';
import API, { settingsAPI, IntegritySettings, AuditEntry } from '../api/api';
import { useNotifications } from '@toolpad/core';
import {
    Accordion, AccordionSummary, AccordionDetails, AccordionActions,
    Button, FormControlLabel, Switch, TextField, Typography, Stack,
    Alert, Slider, Box,
} from '@mui/material';
import { ExpandMore, Verified, History } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

function INTERVAL_LABEL(minutes: number): string {
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes < 1440) {
        const h = minutes / 60;
        return `${Number.isInteger(h) ? h : h.toFixed(1)} hours`;
    }
    const d = minutes / 1440;
    return `${Number.isInteger(d) ? d : d.toFixed(1)} days`;
}

export default function IntegritySettingsPanel(props: any) {
    const notification = useNotifications();

    const [settings, setSettings] = React.useState<IntegritySettings | null>(null);
    const [enabled, setEnabled] = React.useState(true);
    const [intervalMinutes, setIntervalMinutes] = React.useState<number>(1440);
    const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string>('');

    // Audit trail of the last verifications (SOURCE_HASH_VERIFY)
    const [audits, setAudits] = React.useState<AuditEntry[]>([]);

    const loadSettings = React.useCallback(async () => {
        try {
            const res = await settingsAPI.getIntegritySettings();
            setSettings(res.data);
            setEnabled(res.data.enabled);
            setIntervalMinutes(res.data.interval_minutes);
        } catch (e: any) {
            setError(e?.response?.status === 403
                ? 'Administrator role required to view these settings.'
                : 'Failed to load integrity settings.');
        }
    }, []);

    const loadAudits = React.useCallback(async () => {
        try {
            const res = await settingsAPI.getIntegrityAudits();
            setAudits(res.data ?? []);
        } catch {
            // Non-admin users may get 403 on the audit endpoint: silent.
            setAudits([]);
        }
    }, []);

    const loadProfile = React.useCallback(async () => {
        try {
            const res = await API.get('/users/me/');
            setIsAdmin(res.data.role === 'ADMIN');
        } catch {
            setIsAdmin(false);
        }
    }, []);

    React.useEffect(() => {
        (async () => {
            setIsLoading(true);
            await Promise.all([loadProfile(), loadSettings(), loadAudits()]);
            setIsLoading(false);
        })();
    }, [loadProfile, loadSettings, loadAudits]);

    const saveSettings = async () => {
        try {
            const res = await settingsAPI.updateIntegritySettings(enabled, intervalMinutes);
            setSettings(res.data);
            notification.show('Integrity settings saved.', {
                autoHideDuration: 3000, severity: 'success',
            });
        } catch (e: any) {
            const detail = e?.response?.data?.detail ?? 'Error saving integrity settings.';
            notification.show(detail, { autoHideDuration: 4000, severity: 'error' });
        }
    };

    const auditColumns: GridColDef[] = [
        {
            field: 'timestamp', headerName: 'Date', flex: 1,
            valueFormatter: (value) => new Date(value as string).toLocaleString(),
        },
        { field: 'user', headerName: 'User', width: 120 },
        {
            field: 'status', headerName: 'Status', width: 120,
            valueGetter: (_value, row) =>
                (row.detail && row.detail.status) ? String(row.detail.status) : '-',
        },
        { field: 'target', headerName: 'Source', flex: 1 },
    ];

    return (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Verified fontSize="small" />
                    <Typography>Evidence Integrity Verification</Typography>
                </Stack>
            </AccordionSummary>

            <AccordionDetails>
                {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

                {!error && settings && (
                    <Stack spacing={3}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={enabled}
                                    disabled={!isAdmin}
                                    onChange={(e) => setEnabled(e.target.checked)}
                                />
                            }
                            label="Enable periodic verification of evidence hashes"
                        />

                        <Box sx={{ px: 1 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Verification interval: {INTERVAL_LABEL(intervalMinutes)}
                                {!isAdmin && ' (admin only)'}
                            </Typography>
                            {/* Note: linear slider 15min→7d, step 15min.
                                A log scale was tried and removed (mapping bugs
                                with MUI's scale prop + value tracking). */}
                            <Slider
                                min={15}
                                max={10080}                    // 15 min → 7 days
                                step={15}
                                value={intervalMinutes}
                                disabled={!isAdmin || !enabled}
                                marks={[
                                    { value: 15, label: '15m' },
                                    { value: 60, label: '1h' },
                                    { value: 360, label: '6h' },
                                    { value: 1440, label: '1d' },
                                    { value: 10080, label: '7d' },
                                ]}
                                onChange={(_e, value) => setIntervalMinutes(value as number)}
                            />
                            <TextField
                                label="Interval (minutes)"
                                type="number"
                                size="small"
                                value={intervalMinutes}
                                disabled={!isAdmin || !enabled}
                                onChange={(e) => {
                                    const v = parseInt(e.target.value, 10);
                                    if (!isNaN(v)) setIntervalMinutes(Math.max(15, v));
                                }}
                                sx={{ width: 200, mt: 1 }}
                                slotProps={{ htmlInput: { min: 15 } }}
                            />
                        </Box>

                        {settings.updated_at && (
                            <Typography variant="caption" color="text.secondary">
                                Last updated: {new Date(settings.updated_at).toLocaleString()}
                            </Typography>
                        )}

                        {!isAdmin && (
                            <Alert severity="info">
                                Modifications require the Administrator role.
                            </Alert>
                        )}
                    </Stack>
                )}

                {audits.length > 0 && (
                    <Box sx={{ mt: 3, height: 320 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <History fontSize="small" />
                            <Typography variant="body2">Last hash verifications</Typography>
                        </Stack>
                        <DataGrid
                            rows={audits}
                            columns={auditColumns}
                            getRowId={(row) => row.timestamp + row.target}
                            hideFooter={audits.length <= 25}
                            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                        />
                    </Box>
                )}
            </AccordionDetails>

            <AccordionActions>
                <Button
                    onClick={saveSettings}
                    disabled={!isAdmin || isLoading}
                    variant="contained"
                >
                    Save
                </Button>
            </AccordionActions>
        </Accordion>
    );
}
