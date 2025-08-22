'use client'
import * as React from 'react';
import API from '../api/axios'
import { DataGrid , GridFilterModel,GridPaginationModel, GridSortModel} from '@mui/x-data-grid';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { ExpandMore,CheckCircle,Error,NotStarted } from '@mui/icons-material';
import { CircularProgress} from '@mui/material';

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
export default function Hayabusa(props: any){
    const [source,setSource] = React.useState(props.source)
    
    const [taskStatus,setTaskStatus] = React.useState({task_status:'NOT FOUND'})
    
    const [paginationModel,setPaginationModel] = React.useState<GridPaginationModel>({page:0,pageSize:100})
    const [filterModel,setFilterModel] = React.useState<GridFilterModel>({items:[],quickFilterValues:[]})
    const [sortModel,setSortModel] = React.useState<GridSortModel>([])

    const defaultfilter = "source = '"+source.id_source+"' AND plugin = 'hayabusa'"

    const [searchQuery,setSearchQuery] = React.useState([])
    const columns = [
        {field:'Timestamp',headerName:'Timestamp',flex:1},
        {field:'RuleTitle',headerName:'RuleTitle',flex:1},
        {field:'Level',headerName:'Level',flex:1},
        {field:'Channel',headerName:'Channel',flex:1},
        {field:'EventID',headerName:'EventID',flex:1},
        {field:'RecordID',headerName:'RecordID',flex:1},
        {field:'Details',headerName:'Details',flex:1,renderCell: (params: any)=>{
            return(
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore/>}>Details</AccordionSummary>
                <AccordionDetails>
                    {
                        Object.keys(params.value).map((key)=>{
                            return(
                                <Typography key={key}>{key}: {params.value[key]}</Typography>
                            )
                        })
                    }
                </AccordionDetails>
            </Accordion>)
        }},
    ]
    const [rowCount, setRowCount] = React.useState(-1)

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
    },[paginationModel,filterModel])

    React.useEffect(()=>{
            const fechData = async () =>{
                try {
                const res = await  API.get('/api/sources/'+source.id_source+'/tasks/hayabusa')
                setTaskStatus(res.data)
                } catch (error){
                console.error("Erreur lors de la récupération de la tache hayabusa", error)
                }
            };
            fechData();
    },[])

    function loadArtefacts(pagination: GridPaginationModel,filter: GridFilterModel,sort:GridSortModel): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(
                ()=>{
                    API.get('/api/sources/'+source.id_source+'/artefacts/hayabusa/meilisearch',{
                        params:{
                            filter:filter.items.length == 0 ? defaultfilter : defaultfilter +' AND ' + ConvertOperator(filter),
                            q: filter.quickFilterValues !== undefined ? filter.quickFilterValues[0]:'',
                            offset:pagination.page*pagination.pageSize,
                            limit:pagination.pageSize
                        }
                    }).then(res=>{
                        setSearchQuery(res.data.hits);
                        setRowCount(res.data.total);
                    })
                },
            );
        })
    }


    return(
        <Box sx={{width:2000,height:820}}>
                <DataGrid columns={columns} rows={searchQuery}
                    showToolbar
                    getRowHeight={()=>'auto'}
                    key={'artefact-data-grid-'+props.source.id_source+'-hayabusa'}
                    
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
                {
                    taskStatus.task_status === 'NOT FOUND' ? 
                        <NotStarted fontSize="large" color="primary" />
                    : taskStatus.task_status === 'PENDING' ? 
                        <CircularProgress size="30px"/>
                    : taskStatus.task_status === 'SUCCESS' ? 
                        <CheckCircle fontSize="large" color="success" /> 
                    : taskStatus.task_status === 'FAILED' ? 
                        <Error fontSize="large" color="error"/>
                    : 
                    null
                }
        </Box>
    )
}