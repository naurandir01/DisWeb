'use client'
import * as React from 'react';
import { Alert, Card, Collapse, Divider, Snackbar, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridFilterModel,GridPaginationModel, GridSortModel,useGridApiContext,ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  Toolbar,} from '@mui/x-data-grid';
import { CheckCircle,Error,MenuBook,NotStarted} from '@mui/icons-material';
import { CircularProgress} from '@mui/material';
import { taskAPI,artefactAPI } from '../api/api';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import Badge from '@mui/material/Badge';

// Human-readable headers for common Dissect plugin field names.
// Unknown keys fall back to the raw field name (dynamic schemas).
const HEADER_LABELS: Record<string,string> = {
    ts: 'Timestamp',
    lastseen: 'Last seen',
    firstinsert: 'First insertion',
    lastinsert: 'Last insertion',
    lastlogin: 'Last login',
    lastpasswordset: 'Last password set',
    lastincorrectlogin: 'Last incorrect login',
    serial: 'Serial',
    product: 'Product',
    vendor: 'Vendor',
    description: 'Description',
    name: 'Name',
    path: 'Path',
    user: 'User',
    username: 'Username',
    url: 'URL',
    title: 'Title',
    value: 'Value',
    type: 'Type',
    key: 'Key',
    parent: 'Parent',
    source: 'Source',
    hostname: 'Hostname',
    size: 'Size',
    md5: 'MD5',
    sha1: 'SHA-1',
    sha256: 'SHA-256',
    ip: 'IP',
    port: 'Port',
    command: 'Command',
    guid: 'GUID',
    sid: 'SID',
    rid: 'RID',
    comment: 'Comment',
    executionflag: 'Execution flag',
    regfmtime: 'Registry mtime',
    atime: 'Access time',
    mtime: 'Modified time',
    btime: 'Birth time',
    ctime: 'Change time',
    taskpath: 'Task path',
    eventid: 'Event ID',
    channel: 'Channel',
    provider: 'Provider',
    level: 'Level',
    computer: 'Computer',
    recordid: 'Record ID',
};

function humanizeHeader(key: string): string {
    if (HEADER_LABELS[key]) return HEADER_LABELS[key];
    // snake_case / camelCase → spaced words, first letter upper
    return key
        .replace(/_/g,' ')
        .replace(/([a-z])([A-Z])/g,'$1 $2')
        .replace(/^./, c => c.toUpperCase());
}

function ConvertOperator(filterModel: GridFilterModel): string {
    switch(filterModel.items[0].operator){
        case 'contains':
            return filterModel.items[0].field + ' CONTAINS ' + filterModel.items[0].value ;
        case 'doesNotContain':
            return filterModel.items[0].field + ' NOT CONTAINS ' + filterModel.items[0].value ;
        case 'equals':
            return filterModel.items[0].field + ' = ' + filterModel.items[0].value ;
        case 'doesNotEqual':
            return filterModel.items[0].field + ' != ' + filterModel.items[0].value ;
        case 'startsWith':
            return filterModel.items[0].field + ' STARTS WITH ' + filterModel.items[0].value;
        case 'isNotEmpty':
            return filterModel.items[0].field + '  IS NOT EMPTY';
        case 'isEmpty':
            return filterModel.items[0].field + ' IS EMPTY';
        case 'isAnyOf':
            return filterModel.items[0].field + ' IN [' + filterModel.items[0].value+']';
        default:
            return '';  // unsupported operator → ignore the filter server-side
    }
}

export default function ArtefactDataGrid(props: any){
    const [source] = React.useState(props.source)
    const [searchQuery,setSearchQuery] = React.useState<any[]>([])

    const [taskStatus,setTaskStatus] = React.useState({task_status:'NOT FOUND'})

    const [paginationModel,setPaginationModel] = React.useState<GridPaginationModel>({page:0,pageSize:100})
    const [filterModel,setFilterModel] = React.useState<GridFilterModel>({items:[],quickFilterValues:[]})
    const [sortModel,setSortModel] = React.useState<GridSortModel>([])

    const defaultfilter = "source = '"+source.id_source+"' AND plugin = '"+props.artefact.name+"'"

    const [columns, setColumns] = React.useState<GridColDef[]>([])
    const [runOnce, setRunOnce] = React.useState(false)
    const [rowCount, setRowCount] = React.useState(-1)

    // UX: loading indicator + user-visible errors (both were missing: a
    // failed request silently showed an empty grid)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string|null>(null)
    const [refreshTick, setRefreshTick] = React.useState(0)

    // Columns are generated once from the first page of results
    React.useEffect(()=>{
        if (searchQuery.length > 0 && runOnce === false) {
            setColumns(
                Object.keys(searchQuery[0])
                    .filter((key)=> key !== 'domain' && key!== 'generated' && key !== 'classification' && key !== 'version' && key !== 'source' && key !== 'id' && key !== 'case' && key !== 'plugin' && key !== 'hostname')
                    .map((key)=>({
                        field:key,
                        headerName:humanizeHeader(key),   // FIX: raw keys as headers
                        flex:1,
                        minWidth:120,
                    }))
            )
            setRunOnce(true)
        }
    }, [searchQuery, runOnce])

    // Load artefacts with real debouncing + cancellation + error handling.
    // Previously: a zero-delay setTimeout wrapped the call (accidental
    // debounce) with no cancellation between rapid filter keystrokes.
    React.useEffect(()=>{
        let active = true;
        const timer = setTimeout(()=>{
            (async ()=>{
                setIsLoading(true)
                try {
                    const res = await artefactAPI.getSourceArtefact(source.id_source,props.artefact.name,{
                        params:{
                            filter:filterModel.items.length == 0 ? defaultfilter : defaultfilter +' AND ' + ConvertOperator(filterModel),
                            q: filterModel.quickFilterValues !== undefined && filterModel.quickFilterValues.length > 0 ? filterModel.quickFilterValues[0]:'',
                            offset:paginationModel.page*paginationModel.pageSize,
                            limit:paginationModel.pageSize,
                            sort:sortModel.length > 0 ? sortModel[0].field + ':' + sortModel[0].sort : ''
                        }
                    })
                    if (!active) return
                    setSearchQuery(res.data.hits)
                    setRowCount(res.data.total)
                    setError(null)
                } catch (e: any) {
                    if (!active) return
                    setError(e?.response?.data?.detail ?? 'Failed to load artefacts.')
                    setSearchQuery([])
                    setRowCount(0)
                } finally {
                    if (active) setIsLoading(false)
                }
            })()
        }, 300)   // real debounce: pagination clicks fire instantly anyway (300ms is fine for filters)
        return ()=>{ clearTimeout(timer); active = false }
    },[paginationModel,filterModel,sortModel,refreshTick])

    // Poll the task status; auto-refresh the grid when a pending task completes
    React.useEffect(()=>{
        let cancelled = false
        const fechData = async () =>{
            try {
                const res = await  taskAPI.getSourceTask(source.id_source,props.artefact.name)
                if (!cancelled) setTaskStatus(res.data)

                // Auto-refresh when the pending analysis finishes
                if (!cancelled && res.data.task_status === 'PENDING') {
                    setTimeout(fechData, 5000)
                } else if (!cancelled && taskStatus.task_status === 'PENDING' && res.data.task_status === 'SUCCESS') {
                    setRefreshTick(t=>t+1)  // trigger a data reload
                }
            } catch (error){
                console.error("Error fetching task "+props.artefact.name, error)
            }
        };
        fechData();
        return ()=>{ cancelled = true }
    },[])

    function CustomToolbar(){
        return(
            <Toolbar>
                <Tooltip title={props.artefact.doc ?? ''}>
                    <MenuBook fontSize="small"/>
                </Tooltip>
                {
                        taskStatus.task_status === 'NOT FOUND' ?
                            <Tooltip title="Analysis not started yet">
                                <NotStarted fontSize="small" color="primary" />
                            </Tooltip>
                        : taskStatus.task_status === 'PENDING' ?
                            <Tooltip title="Analysis running...">
                                <CircularProgress size="16px"/>
                            </Tooltip>
                        : taskStatus.task_status === 'SUCCESS' ?
                            <Tooltip title="Analysis completed">
                                <CheckCircle fontSize="small" color="success" />
                            </Tooltip>
                        : taskStatus.task_status === 'FAILED' ?
                            <Tooltip title="Analysis failed">
                                <Error fontSize="small" color="error"/>
                            </Tooltip>
                        :
                        null
                }
                <Divider orientation="vertical" flexItem sx={{mx:1}}/>
                <Tooltip title="Columns">
                    <ColumnsPanelTrigger render={<ToolbarButton/>}>
                        <ViewColumnIcon fontSize="small"/>
                    </ColumnsPanelTrigger>
                </Tooltip>
                <Tooltip title="Filters">
                    <FilterPanelTrigger
                        render={(btnprops, state) => (
                            <ToolbarButton {...btnprops} color="default">
                                <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                                    <FilterListIcon fontSize="small" />
                                </Badge>
                            </ToolbarButton>
                        )}
                    />
                </Tooltip>
                <Divider orientation="vertical" flexItem sx={{mx:1}}/>
                <Typography variant="caption" color="text.secondary" sx={{ml:'auto'}}>
                    {rowCount >= 0 ? rowCount.toLocaleString()+' records' : ''}
                </Typography>
            </Toolbar>
        )
    }

    return(
        <Card sx={{height:820,width:'inherit',flex:1,display:'flex',flexDirection:'column'}}>
            <Collapse in={error !== null}>
                <Alert severity="error" onClose={()=>setError(null)}>{error}</Alert>
            </Collapse>
             <DataGrid columns={columns} rows={searchQuery}
                getRowHeight={()=>'auto'}
                showToolbar
                loading={isLoading}
                key={'artefact-data-grid-'+props.source.id_source+'-'+props.id}
                slotProps={{ toolbar: { showQuickFilter: false } }}
                slots={{toolbar:CustomToolbar}}

                pagination
                paginationMode='server'
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                rowCount={rowCount}

                filterMode='server'
                onFilterModelChange={setFilterModel}
                filterModel={filterModel}

                sortingMode="server"
                onSortModelChange={setSortModel}
                sortModel={sortModel}

                localeText={{ noRowsLabel: taskStatus.task_status === 'NOT FOUND'
                    ? 'No data yet — click to launch the analysis'
                    : taskStatus.task_status === 'PENDING'
                    ? 'Analysis in progress...'
                    : 'No records' }}
                />
        </Card>

    )
}
