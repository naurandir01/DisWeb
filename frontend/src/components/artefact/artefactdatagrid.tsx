'use client'
import * as React from 'react';
import {  Card, Divider, Tooltip, Typography } from '@mui/material';
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

function  ConvertOperator(filterModel: GridFilterModel){
    switch(filterModel.items[0].operator){
        case 'contains':
            return filterModel.items[0].field + ' CONTAINS '+filterModel.items[0].value ;
        case 'doesNotContain':
            return filterModel.items[0].field + ' NOT CONTAINS '+filterModel.items[0].value ;
        case 'equals':
            return filterModel.items[0].field + ' = ' +filterModel.items[0].value ;
        case 'doesNotEqual':
            return filterModel.items[0].field + ' != ' +filterModel.items[0].value ;
        case 'startsWith':
            return filterModel.items[0].field + ' STARTS WITH '+filterModel.items[0].value;
        case 'isNotEmpty':
            return filterModel.items[0].field + '  IS NOT EMPTY';
        case 'isEmpty':
            return filterModel.items[0].field + ' IS EMPTY';
        case 'isAnyOf':
            return filterModel.items[0].field + ' IN ['+ filterModel.items[0].value+']'; ;
    }
}





export default function ArtefactDataGrid(props: any){
    const [source,setSource] = React.useState(props.source)
    const [searchQuery,setSearchQuery] = React.useState([])
    
    const [taskStatus,setTaskStatus] = React.useState({task_status:'NOT FOUND'})
    
    const [paginationModel,setPaginationModel] = React.useState<GridPaginationModel>({page:0,pageSize:100})
    const [filterModel,setFilterModel] = React.useState<GridFilterModel>({items:[],quickFilterValues:[]})
    const [sortModel,setSortModel] = React.useState<GridSortModel>([])
    
    const defaultfilter = "source = '"+source.id_source+"' AND plugin = '"+props.artefact.name+"'"
    
    const [columns, setColumns] = React.useState<GridColDef[]>([])
    const [runOnce, setRunOnce] = React.useState(false)
    const [rowCount, setRowCount] = React.useState(-1)


    // Allow the generation of columns based on the result of the search query. Only run once to avoid the rest of the filtermodel
    React.useEffect(()=>{
        searchQuery.length > 0 && runOnce === false ? 
           (setColumns(Object.keys(searchQuery[0])
                .filter((key)=> key !== 'domain' && key!== 'generated' && key !== 'classification' && key !== 'version' && key !== 'source' && key !== 'id' && key !== 'case' && key !== 'plugin' && key !== 'hostname')
                .map((key)=>(
                    {field:key,headerName:key,flex:1}
                ))),setRunOnce(true))

        :null       
    }, [searchQuery])

    React.useEffect(()=>{
        let active = true;
        
        (
            async ()=>{
                const newsrows = await loadArtefacts(paginationModel,filterModel,sortModel);
                if (!active) {
                    return;
                }
            }
        )();
    },[paginationModel,filterModel,sortModel])

    React.useEffect(()=>{
        const fechData = async () =>{
            try {
            const res = await  taskAPI.getSourceTask(source.id_source,props.artefact.name)
            setTaskStatus(res.data)
            } catch (error){
            console.error("Erreur lors de la récupération de la tache "+props.artefact.name, error)
            }
        };
        fechData();
    },[])

    function loadArtefacts(pagination: GridPaginationModel,filter: GridFilterModel,sort:GridSortModel): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(
                ()=>{
                    artefactAPI.getSourceArtefact(source.id_source,props.artefact.name,{ 
                        params:{
                            filter:filter.items.length == 0 ? defaultfilter : defaultfilter +' AND ' + ConvertOperator(filter),
                            q: filter.quickFilterValues !== undefined ? filter.quickFilterValues[0]:'',
                            offset:pagination.page*pagination.pageSize,
                            limit:pagination.pageSize,
                            sort:sort.length > 0 ? sort[0].field + ':' + sort[0].sort : ''
                            
                        }
                    }).then(res=>{
                        setSearchQuery(res.data.hits);
                        setRowCount(res.data.total);
                        
                    })
                },
            );
        })
    }

    function CustomToolbar(){
    
        const apiRef = useGridApiContext();

        return(
            <Toolbar>
                <Tooltip title={props.artefact.doc}>
                    <MenuBook fontSize="small"/>
                </Tooltip>
                {
                        taskStatus.task_status === 'NOT FOUND' ? 
                            <NotStarted fontSize="small" color="primary" />
                        : taskStatus.task_status === 'PENDING' ? 
                            <CircularProgress size="30px"/>
                        : taskStatus.task_status === 'SUCCESS' ? 
                            <CheckCircle fontSize="small" color="success" /> 
                        : taskStatus.task_status === 'FAILED' ? 
                            <Error fontSize="small" color="error"/>
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
                        render={(props, state) => (
                            <ToolbarButton {...props} color="default">
                                <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                                    <FilterListIcon fontSize="small" />
                                </Badge>
                            </ToolbarButton>
                        )}
                    />
                </Tooltip>
            </Toolbar>
        )

    }
    
    return(
        <Card sx={{height:820,width:'inherit',flex:1,display:'flex',flexDirection:'column'}}>
             <DataGrid columns={columns} rows={searchQuery}
                getRowHeight={()=>'auto'}
                showToolbar
                key={'artefact-data-grid-'+props.source.id_source+'-'+props.id}
                //loading={loading}
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
            
                />
        </Card>

    )
}