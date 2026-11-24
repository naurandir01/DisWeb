// frontend/src/components/yara/yaradatagrid.tsx
'use client'
import * as React from 'react';
import { Alert, Box, Button, Chip, Grid, InputAdornment, MenuItem, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CheckCircle, Error as ErrorIcon, PlayArrow, NotStarted } from '@mui/icons-material';
import { useSessionStorageState, useNotifications } from '@toolpad/core';
import { yaraAPI } from '../api/api';
import { taskAPI } from '../api/api';

type TaskStatus = 'NOT FOUND' | 'PENDING' | 'SUCCESS' | 'FAILED' | '';

const SIZE_PRESETS = [
    { label: 'Small files (< 1 MB)', value: 1_000_000 },
    { label: 'Default (< 100 MB)', value: 100_000_000 },
    { label: 'Large files (< 1 GB)', value: 1_000_000_000 },
    { label: 'Everything (no limit)', value: 1_000_000_000_000 },
]

export default function YaraDataGrid(props: any){
    const source = props.source
    const [listYaraRules] = useSessionStorageState('listyararules', '[]')
    const [currentYaraRule, setCurrentYaraRule] = React.useState<any>(null)
    const [currentYaraRuleStatus, setCurrentYaraRuleStatus] = React.useState<TaskStatus>('')
    const [currentYaraRuleResults, setCurrentYaraRuleResults] = React.useState<any[]>([])
    const [currentYaraRuleSize, setCurrentYaraRuleSize] = React.useState<number>(100_000_000)
    const [isLaunching, setIsLaunching] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const notification = useNotifications()

    // FIX: defensive parse of the session-stored rule list
    const yaraRules: any[] = React.useMemo(() => {
        try { return JSON.parse(listYaraRules || '[]') } catch { return [] }
    }, [listYaraRules])

    const loadResults = React.useCallback(async () => {
        if (!currentYaraRule) return
        try {
            const res = await yaraAPI.runYaraScanOnSource(
                source.id_source, currentYaraRule.id_yararule, 0
            )
            if (res.data.pending === false && Array.isArray(res.data.values)) {
                setCurrentYaraRuleResults(res.data.values)
            }
        } catch {
            setError('Failed to load YARA results.')
        }
    }, [source.id_source, currentYaraRule])

    // FIX: polling was missing — a PENDING scan stayed PENDING forever in
    // the UI until the rule was re-selected. Single chained polling loop
    // (same pattern as the plugins), stops on terminal states.
    React.useEffect(() => {
        if (!currentYaraRule) return
        let cancelled = false
        let timer: ReturnType<typeof setTimeout>

        const tick = async () => {
            try {
                const res = await taskAPI.getSourceTask(source.id_source, 'yara_' + currentYaraRule.yararule_name)
                if (cancelled) return
                const next: TaskStatus = res.data.task_status ?? 'NOT FOUND'
                setCurrentYaraRuleStatus(next)
                if (next === 'SUCCESS') {
                    await loadResults()
                    return // stop polling
                }
                if (next !== 'FAILED') {
                    timer = setTimeout(tick, 5000)
                }
            } catch {
                if (!cancelled) timer = setTimeout(tick, 5000) // transient errors: keep trying
            }
        }
        tick()

        return () => { cancelled = true; clearTimeout(timer) }
    }, [source.id_source, currentYaraRule, loadResults])

    // FIX: try/catch around a promise catches nothing — errors are now
    // awaited and surfaced; double-launch guarded; PENDING re-launch blocked.
    const handleStartYaraRule = async () => {
        if (!currentYaraRule) return
        if (currentYaraRuleStatus === 'PENDING' || isLaunching) return
        setIsLaunching(true)
        setError(null)
        try {
            await yaraAPI.runYaraScanOnSource(source.id_source, currentYaraRule.id_yararule, currentYaraRuleSize)
            notification.show('YARA scan "' + currentYaraRule.yararule_name + '" launched',
                { autoHideDuration: 3000, severity: 'success' })
            setCurrentYaraRuleStatus('PENDING')
            setCurrentYaraRuleResults([])
        } catch (e: any) {
            if (e?.response?.status === 404) {
                setError('YARA rule file missing on the server.')
            } else {
                setError('Failed to start YARA rule "' + currentYaraRule.yararule_name + '".')
            }
        } finally {
            setIsLaunching(false)
        }
    }

    const columns: GridColDef[] = [
        {
            field: 'path', headerName: 'Matched path', flex: 1, minWidth: 300,
            renderCell: (params: any) => (
                <Typography variant="body2" fontFamily="monospace" noWrap
                            sx={{ direction: 'rtl', textAlign: 'left' }}
                            title={params.row.path}>
                    {params.row.path}
                </Typography>
            ),
        },
        { field: 'rule', headerName: 'Rule', width: 180,
          renderCell: (params: any) => (
              <Chip size="small" color="warning" variant="outlined" label={params.row.rule}/>
          ) },
        { field: 'digest', headerName: 'Digest', flex: 1, minWidth: 200,
          renderCell: (params: any) => (
              <Typography variant="caption" fontFamily="monospace">{params.row.digest ?? '-'}</Typography>
          ) },
        { field: 'strings', headerName: 'Matched strings', flex: 1, minWidth: 200,
          renderCell: (params: any) => (
              <Typography variant="caption" fontFamily="monospace" noWrap
                          title={JSON.stringify(params.row.strings ?? '')}>
                  {params.row.strings ? JSON.stringify(params.row.strings) : '-'}
              </Typography>
          ) },
    ]

    return (
        <Box sx={{ height: 830, width: 'inherit', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Grid container sx={{ justifyContent: "flex-start", alignItems: "center" }} spacing={2}>
                <Grid size={6}>
                    {/* FIX: select was uncontrolled (no value binding) — MUI
                        showed the menu as always "empty-looking" after re-render */}
                    <TextField
                        id="select-yara-rules" select fullWidth
                        label="YARA rule"
                        value={currentYaraRule?.id_yararule ?? ''}
                        onChange={(e) => {
                            const rule = yaraRules.find(r => r.id_yararule === e.target.value) ?? null
                            setCurrentYaraRule(rule)
                            setCurrentYaraRuleStatus('')
                            setCurrentYaraRuleResults([])
                            setError(null)
                        }}
                    >
                        {yaraRules.map((rule: any) => (
                            <MenuItem key={rule.id_yararule} value={rule.id_yararule}>
                                {rule.yararule_name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={3}>
                    {/* FIX: free numeric input was unclear ("in octet") —
                        presets + human-readable helper text. Raw values stay
                        possible via the presets; sizes are what YARA actually
                        accepts, rounded to the chosen preset. */}
                    <TextField
                        select fullWidth
                        label="File size limit"
                        value={currentYaraRuleSize}
                        onChange={(e) => setCurrentYaraRuleSize(Number(e.target.value))}
                        helperText="Max size of scanned files"
                    >
                        {SIZE_PRESETS.map(p => (
                            <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={3}>
                    <Button
                        fullWidth variant="contained"
                        startIcon={currentYaraRuleStatus === 'SUCCESS' ? <CheckCircle/> : <PlayArrow/>}
                        disabled={!currentYaraRule || currentYaraRuleStatus === 'PENDING' ||
                                  currentYaraRuleStatus === 'SUCCESS' || isLaunching}
                        onClick={handleStartYaraRule}
                    >
                        {currentYaraRuleStatus === 'PENDING' ? 'Scanning…'
                            : currentYaraRuleStatus === 'SUCCESS' ? 'Completed'
                            : currentYaraRuleStatus === 'FAILED' ? 'Retry scan'
                            : 'Run YARA scan'}
                    </Button>
                    {currentYaraRuleStatus === 'FAILED' && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                            The scan failed — check the worker logs, then retry.
                        </Alert>
                    )}
                </Grid>
                {error && (
                    <Grid size={12}>
                        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
                    </Grid>
                )}
                <Grid size={12}>
                    <Box sx={{ height: 700, width: 'inherit', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <DataGrid
                            rows={currentYaraRuleResults}
                            columns={columns}
                            getRowId={(row: any) =>
                                row.path + '|' + row.rule + '|' + row.digest}
                            showToolbar
                            loading={currentYaraRuleStatus === 'PENDING'}
                            getRowHeight={() => 'auto'}
                            localeText={{ noRowsLabel: !currentYaraRule
                                ? 'Select a YARA rule to scan this source'
                                : currentYaraRuleStatus === 'PENDING'
                                ? 'Scanning the evidence image…'
                                : currentYaraRuleStatus === 'SUCCESS'
                                ? 'No match — the evidence is clean for this rule'
                                : 'Run the scan to see matches' }}
                            initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}
