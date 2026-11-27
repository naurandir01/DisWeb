// frontend/src/components/artefact/event.tsx
'use client'
import * as React from 'react';
import { Alert, Box, Card, CardContent, CardHeader, Chip, Divider, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { CheckCircle, Error, NotStarted } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { useSessionStorageState } from '@toolpad/core';
import { sourceAPI, taskAPI, artefactAPI } from '../api/api';

function ConvertOperator(filterModel: GridFilterModel){
    switch(filterModel.items[0].operator){
        case 'contains':
            return filterModel.items[0].field + ' CONTAINS ' + filterModel.items[0].value;
        case 'doesNotContain':
            return filterModel.items[0].field + ' NOT CONTAINS ' + filterModel.items[0].value;
        case 'equals':
            return filterModel.items[0].field + ' = ' + filterModel.items[0].value;
        case 'doesNotEqual':
            return filterModel.items[0].field + ' != ' + filterModel.items[0].value;
        case 'startsWith':
            return filterModel.items[0].field + ' STARTS WITH ' + filterModel.items[0].value;
        case 'isNotEmpty':
            return filterModel.items[0].field + '  IS NOT EMPTY';
        case 'isEmpty':
            return filterModel.items[0].field + ' IS EMPTY';
        case 'isAnyOf':
            return filterModel.items[0].field + ' IN [' + filterModel.items[0].value + ']';
        default:
            return '';
    }
}

// Standard Windows Event Log severity levels
const LEVEL_INFO: Record<string, {label: string, color: any}> = {
    '0': {label: 'Information', color: 'default'},
    'Information': {label: 'Information', color: 'default'},
    '2': {label: 'Error', color: 'error'},
    'Error': {label: 'Error', color: 'error'},
    '3': {label: 'Warning', color: 'warning'},
    'Warning': {label: 'Warning', color: 'warning'},
    '4': {label: 'Information', color: 'info'},
}

function levelInfo(level: any) {
    return LEVEL_INFO[String(level ?? '')] ?? {label: String(level ?? '-'), color: 'default'}
}

// Well-known Event IDs worth surfacing (quick triage aid for analysts)
const KNOWN_EVENT_IDS: Record<string, string> = {
    '4624': 'Successful logon',
    '4625': 'Failed logon',
    '4634': 'Logoff',
    '4648': 'Logon with explicit credentials',
    '4672': 'Special privileges assigned',
    '4688': 'Process creation',
    '4698': 'Scheduled task created',
    '4720': 'User account created',
    '4726': 'User account deleted',
    '4732': 'Member added to group',
    '7045': 'Service installed',
    '1102': 'Audit log cleared',
    '4104': 'PowerShell script block',
}

export default function Events(props: any){
    const [currentCas, setCurrentCas] = useSessionStorageState('cas','')
    const source = props.source
    const [taskStatus, setTaskStatus] = React.useState<any>({task_status: 'NOT FOUND'})
    const [selectedRow, setSelectedRow] = React.useState<any>({});
    const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({page: 0, pageSize: 100})
    const [filterModel, setFilterModel] = React.useState<GridFilterModel>({items: [], quickFilterValues: []})
    const [sortModel, setSortModel] = React.useState<GridSortModel>([{field: 'ts', sort: 'desc'}])

    const [searchQuery, setSearchQuery] = React.useState<any[]>([])
    const [rowsCount, setRowsCount] = React.useState(-1)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const defaultfilter = "source = '" + source.id_source + "' AND plugin = 'evtx'"

    const columns: GridColDef[] = [
        {
            field: 'ts', headerName: 'Timestamp', flex: 1, minWidth: 170,
            renderCell: (params: any) => (
                <Tooltip title={params.row.ts ?? ''}>
                    <Typography variant="body2" fontFamily="monospace" noWrap>
                        {params.value ?? '-'}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            field: 'Channel', headerName: 'Channel', flex: 1, minWidth: 180,
            renderCell: (params: any) => (
                <Typography variant="caption" fontFamily="monospace" noWrap>
                    {params.value ?? '-'}
                </Typography>
            ),
        },
        {
            field: 'EventID', headerName: 'Event ID', width: 190,
            renderCell: (params: any) => {
                const known = KNOWN_EVENT_IDS[String(params.value ?? '')]
                return (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Chip size="small" variant="outlined" label={params.value ?? '-'}/>
                        {known && (
                            <Tooltip title={known}>
                                <Typography variant="caption" color="text.secondary" noWrap>
                                    {known}
                                </Typography>
                            </Tooltip>
                        )}
                    </Stack>
                )
            },
        },
        {
            field: 'Level', headerName: 'Level', width: 130,
            renderCell: (params: any) => {
                const li = levelInfo(params.value)
                return <Chip size="small" color={li.color} variant="outlined" label={li.label}/>
            },
        },
        { field: 'Provider', headerName: 'Provider', flex: 1, minWidth: 170,
          renderCell: (params: any) => (
              <Typography variant="caption" noWrap title={params.value ?? ''}>{params.value ?? '-'}</Typography>
          ) },
        { field: 'Computer', headerName: 'Computer', flex: 1, minWidth: 150,
          renderCell: (params: any) => (
              <Typography variant="caption" noWrap>{params.value ?? '-'}</Typography>
          ) },
    ]

    // FIX: polling on the evtx task — the status was frozen at mount;
    // when the analysis finished, the grid never auto-refreshed.
    React.useEffect(() => {
        let cancelled = false
        let timer: ReturnType<typeof setTimeout>

        const tick = async () => {
            try {
                const res = await taskAPI.getSourceTask(source.id_source, 'evtx')
                if (cancelled) return
                const next = res.data.task_status ?? 'NOT FOUND'
                setTaskStatus({task_status: next})
                if (next === 'PENDING') {
                    timer = setTimeout(tick, 5000)
                }
            } catch (e) {
                console.error('Error fetching the evtx task', e)
            }
        }
        tick()
        return () => { cancelled = true; clearTimeout(timer) }
    }, [source.id_source])

    // FIX: real debounce + cancellation + loading + errors + rowCount
    React.useEffect(() => {
        let active = true
        const timer = setTimeout(() => {
            (async () => {
                setIsLoading(true)
                try {
                    const res = await artefactAPI.getSourceArtefact(source.id_source, 'evtx', {
                        params: {
                            filter: filterModel.items.length === 0
                                ? defaultfilter
                                : defaultfilter + ' AND ' + ConvertOperator(filterModel),
                            q: filterModel.quickFilterValues?.[0] ?? '',
                            offset: paginationModel.page * paginationModel.pageSize,
                            limit: paginationModel.pageSize,
                        }
                    })
                    if (!active) return
                    setSearchQuery(res.data.hits)
                    setRowsCount(res.data.total)
                    setError(null)
                } catch {
                    if (active) setError('Failed to load the event logs.')
                } finally {
                    if (active) setIsLoading(false)
                }
            })()
        }, 300)
        return () => { clearTimeout(timer); active = false }
    }, [paginationModel, filterModel, source.id_source])

    const notToDisplay = ['id', 'domain', 'source', 'case', 'plugin', 'generated', 'classification']

    const detailsKeys = Object.keys(selectedRow).filter(k => !notToDisplay.includes(k))

    return (
        <Card sx={{ height: 1100, width: 'inherit' }}>
            <CardHeader
                avatar={
                    <Tooltip title={
                        taskStatus.task_status === 'NOT FOUND' ? 'EVTX analysis not started'
                        : taskStatus.task_status === 'PENDING' ? 'EVTX analysis running…'
                        : taskStatus.task_status === 'SUCCESS' ? 'EVTX analysis completed'
                        : 'EVTX analysis failed'
                    }>
                        {taskStatus.task_status === 'NOT FOUND' ?
                            <NotStarted fontSize="large" color="primary"/>
                        : taskStatus.task_status === 'PENDING' ?
                            <CircularProgress size="30px"/>
                        : taskStatus.task_status === 'SUCCESS' ?
                            <CheckCircle fontSize="large" color="success"/>
                        : <Error fontSize="large" color="error"/>}
                    </Tooltip>
                }
                title="Windows Event Logs"
                subheader={rowsCount >= 0
                    ? <Typography variant="caption" color="text.secondary">
                        {rowsCount.toLocaleString()} events indexed
                      </Typography>
                    : undefined}
            />
            <CardContent>
                {error && <Alert severity="error" sx={{mb: 1}} onClose={() => setError(null)}>{error}</Alert>}
                <Grid container spacing={2} sx={{justifyContent: "flex-start", alignItems: "flex-start"}}>
                    <Grid size={6}>
                        <div style={{ height: 860 }}>
                            <DataGrid
                                columns={columns}
                                rows={searchQuery}
                                getRowHeight={() => 'auto'}
                                loading={isLoading}
                                slotProps={{ toolbar: { showQuickFilter: false } }}

                                onRowClick={(params: any) => setSelectedRow(params.row)}
                                showToolbar

                                paginationMode='server'
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                rowCount={rowsCount}

                                filterMode='server'
                                onFilterModelChange={setFilterModel}
                                filterModel={filterModel}

                                sortingMode='server'
                                onSortModelChange={setSortModel}
                                sortModel={sortModel}
                                localeText={{ noRowsLabel: taskStatus.task_status === 'PENDING'
                                    ? 'EVTX analysis in progress…'
                                    : taskStatus.task_status === 'NOT FOUND'
                                    ? 'No EVTX data — launch the analysis first'
                                    : 'No event' }}
                                initialState={{ pagination: { paginationModel: { pageSize: 100 } } }}
                            />
                        </div>
                    </Grid>
                    <Grid size={6}>
                        <Card variant="outlined" sx={{ width: '100%', minHeight: 860 }}>
                            <CardHeader
                                title="Event Details"
                                subheader={selectedRow.EventID !== undefined
                                    ? <Stack direction="row" spacing={1} alignItems="center" sx={{mt: 0.5}}>
                                        <Chip size="small" color={levelInfo(selectedRow.Level).color}
                                              variant="outlined"
                                              label={`ID ${selectedRow.EventID ?? '-'}`}/>
                                        {KNOWN_EVENT_IDS[String(selectedRow.EventID ?? '')] && (
                                            <Typography variant="caption" color="text.secondary">
                                                {KNOWN_EVENT_IDS[String(selectedRow.EventID)]}
                                            </Typography>
                                        )}
                                      </Stack>
                                    : undefined}/>
                            <CardContent>
                                {Object.keys(selectedRow).length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">
                                        Click an event in the grid to inspect its complete record.
                                    </Typography>
                                ) : (
                                    <Stack spacing={0.75}>
                                        {detailsKeys.map((key: string) => (
                                            <Stack key={key} direction="row" spacing={1}
                                                   sx={{ minHeight: 28, borderBottom: '1px dashed rgba(0,0,0,0.08)' }}>
                                                <Typography variant="caption" color="text.secondary"
                                                            fontFamily="monospace" sx={{ minWidth: 160 }}>
                                                    {key}
                                                </Typography>
                                                <Tooltip title={String(selectedRow[key] ?? '')}>
                                                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                                        {selectedRow[key] === null ? '—' : String(selectedRow[key])}
                                                    </Typography>
                                                </Tooltip>
                                            </Stack>
                                        ))}
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
