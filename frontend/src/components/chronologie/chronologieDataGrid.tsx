// frontend/src/components/chronologie/chronologieDataGrid.tsx
'use client'
import * as React from 'react';
import { useSessionStorageState } from '@toolpad/core';
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridRowModel, GridSortModel } from '@mui/x-data-grid';
import API from '../api/axios'
import { Box, Button, Card, CardContent, CardHeader, Chip, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { FilterAltOff } from '@mui/icons-material';

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
        case 'is':
            return filterModel.items[0].field + ' = ' + filterModel.items[0].value;
        case 'not':
            return filterModel.items[0].field + ' != ' + filterModel.items[0].value;
        case 'after':
            return filterModel.items[0].field + ' > ' + filterModel.items[0].value;
        case 'before':
            return filterModel.items[0].field + ' < ' + filterModel.items[0].value;
        case 'onOrAfter':
            return filterModel.items[0].field + ' >= ' + filterModel.items[0].value;
        case 'onOrBefore':
            return filterModel.items[0].field + ' <= ' + filterModel.items[0].value;
        default:
            return '';
    }
}

export default function ChronologieDataGrid(props: any){
    const [currentCas] = useSessionStorageState('cas','')
    const [listSources] = useSessionStorageState('listsources','[]')

    const [rows, setRows] = React.useState<GridRowModel[]>([])
    const [rowsCount, setRowsCount] = React.useState(-1)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({page: 0, pageSize: 100})
    const [filterModel, setFilterModel] = React.useState<GridFilterModel>({items: []})
    const [sortModel, setSortModel] = React.useState<GridSortModel>([{field: 'ts', sort: 'desc'}])

    const caseId = React.useMemo(() => {
        try { return JSON.parse(currentCas || "{}{'id_case':'0'}").id_case ?? '' } catch { return '' }
    }, [currentCas])

    // Null-safe source map (FIX bug #10: .find(...).source_name crashed on
    // every cell when a source wasn't in the session storage anymore)
    const sourceNameById = React.useMemo(() => {
        try {
            const sources = JSON.parse(listSources || '[]') as any[]
            return Object.fromEntries(sources.map((s: any) => [s.id_source, s.source_name]))
        } catch { return {} }
    }, [listSources])

    const defaultfilter = "case = '" + caseId + "' AND ts EXISTS"

    // FEATURE (A1): clicking a graph bar filters this grid on the selected
    // drill-down timestamp. The prop comes from chronologieGraph via the page.
    const drillDownTs: string = props.currentTimeStampGlobal ?? ''

    const columns: GridColDef[] = [
        {
            field: 'source', headerName: 'Source', flex: 1, minWidth: 160,
            renderCell: (params: any) => (
                <Tooltip title={params.value ?? ''}>
                    <Typography variant="body2" noWrap>
                        {sourceNameById[params.value] ?? (params.value ? params.value.substring(0, 8) + '…' : '-')}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            field: 'ts', headerName: 'Timestamp', flex: 1, type: 'dateTime',
            valueGetter: (value: string) => value ? new Date(value) : null,
            // ISO 8601 in tooltip for report-writing (FIX bug #14)
            renderCell: (params: any) => (
                <Tooltip title={params.row.ts ?? ''}>
                    <span>{params.formattedValue}</span>
                </Tooltip>
            ),
        },
        { field: 'plugin', headerName: 'Type', flex: 1, minWidth: 130,
          renderCell: (params: any) => <Chip size="small" variant="outlined" label={params.value ?? '-'}/> },
    ]

    // FIX (bugs #11/#12): real debounce + cancellation, null-safe quick
    // filter, loading wired (was commented out), errors surfaced
    React.useEffect(() => {
        if (!caseId) return
        let active = true
        const timer = setTimeout(() => {
            (async () => {
                setIsLoading(true)
                try {
                    const res = await API.get('/cases/' + caseId + '/timelinemeilisearch/', {
                        params: {
                            filter: (filterModel.items.length === 0 ? defaultfilter : defaultfilter + ' AND ' + ConvertOperator(filterModel))
                                + (drillDownTs ? " AND ts CONTAINS '" + drillDownTs + "'" : ''),
                            q: filterModel.quickFilterValues?.[0] ?? '',
                            offset: paginationModel.page * paginationModel.pageSize,
                            limit: paginationModel.pageSize,
                            sort: sortModel.length > 0 ? sortModel[0].field + ':' + sortModel[0].sort : 'ts:desc',
                        }
                    })
                    if (!active) return
                    setRows(res.data.hits)
                    setRowsCount(res.data.total)
                    setError(null)
                } catch {
                    if (active) setError('Failed to load the timeline events.')
                } finally {
                    if (active) setIsLoading(false)
                }
            })()
        }, 300)
        return () => { clearTimeout(timer); active = false }
    }, [paginationModel, filterModel, sortModel, drillDownTs, caseId])

    const notToDisplay = ['id', 'source', 'case', 'generated', 'classification']

    const [event, setEvent] = React.useState<any>({})

    const removeDrillDown = () => {
        props.onClearTimeStampGlobal?.()
    }

    return (
        <Box sx={{ height: 'auto' }}>
            <Grid container spacing={2}>
                <Grid size={4}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, minHeight: 32 }} useFlexGap flexWrap="wrap">
                        {drillDownTs && (
                            <>
                                <Chip size="small" color="primary"
                                      label={`Filtered on ${drillDownTs.replace('T', ' ')}`}
                                      onDelete={removeDrillDown}
                                      deleteIcon={<FilterAltOff/>}/>
                                <Button size="small" onClick={removeDrillDown}>Clear</Button>
                            </>
                        )}
                        {rowsCount >= 0 && (
                            <Typography variant="caption" color="text.secondary">
                                {rowsCount.toLocaleString()} events
                            </Typography>
                        )}
                    </Stack>
                    {error && (
                        <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>{error}</Typography>
                    )}
                    <div style={{ height: 860 }}>
                        <DataGrid
                            columns={columns}
                            rows={rows}
                            loading={isLoading}
                            showToolbar
                            pagination
                            rowCount={rowsCount}
                            slotProps={{ toolbar: { showQuickFilter: false } }}
                            onRowClick={(params: any) => setEvent(params.row)}
                            paginationMode='server'
                            onPaginationModelChange={setPaginationModel}
                            paginationModel={paginationModel}
                            filterMode='server'
                            onFilterModelChange={setFilterModel}
                            filterModel={filterModel}
                            sortingMode='server'
                            onSortModelChange={setSortModel}
                            sortModel={sortModel}
                            getRowHeight={() => 'auto'}
                            localeText={{ noRowsLabel: drillDownTs
                                ? 'No event in this period'
                                : 'No timeline event yet — run the Timeline plugin on a source' }}
                        />
                    </div>
                </Grid>
                <Grid size={8}>
                    <Card>
                        <CardHeader title="Event Details"
                            subheader={event.ts
                                ? <Typography variant="caption" color="text.secondary">{event.ts}</Typography>
                                : undefined}/>
                        <CardContent>
                            {Object.keys(event).length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    Click an event in the grid to inspect all its fields.
                                </Typography>
                            ) : (
                                <Stack spacing={0.75}>
                                    {Object.keys(event)
                                        .filter((key) => !notToDisplay.includes(key) && key !== 'domain' && key !== 'source' && key !== 'case')
                                        .map((key: any) => (
                                            <Stack key={key} direction="row" spacing={1}
                                                   sx={{ minHeight: 28, borderBottom: '1px dashed rgba(0,0,0,0.08)' }}>
                                                <Typography variant="caption" color="text.secondary"
                                                            fontFamily="monospace" sx={{ minWidth: 180 }}>
                                                    {key}
                                                </Typography>
                                                <Tooltip title={String(event[key] ?? '')}>
                                                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                                        {event[key] === null ? '—' : String(event[key])}
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
        </Box>
    )
}
