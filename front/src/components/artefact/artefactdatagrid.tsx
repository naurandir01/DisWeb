'use client'
import * as React from 'react';
import API from '../api/axios';
import {  Card, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridFilterModel,GridPaginationModel, GridSortModel} from '@mui/x-data-grid';
import { useSessionStorageState } from '@toolpad/core';
import { CheckCircle,Error,NotStarted} from '@mui/icons-material';
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

export default function ArtefactDataGrid(props: any){
    const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
    const [source,setSource] = React.useState(props.source)
    
    const [searchQuery,setSearchQuery] = React.useState([])
    
    const [taskStatus,setTaskStatus] = React.useState({task_status:'NOT FOUND'})
    
    const [paginationModel,setPaginationModel] = React.useState<GridPaginationModel>({page:0,pageSize:100})
    const [filterModel,setFilterModel] = React.useState<GridFilterModel>({items:[],quickFilterValues:[]})
    const [sortModel,setSortModel] = React.useState<GridSortModel>([])
    
    const defaultfilter = "source = '"+source.id_source+"' AND plugin = '"+props.artefact.name+"'"
    
    const [columns, setColumns] = React.useState<GridColDef[]>([])
    const [runOnce, setRunOnce] = React.useState(false)


    // Allow the generation of columns based on the result of the search query
    React.useEffect(()=>{
        searchQuery.length > 0 && runOnce === false ? 
           (setColumns(Object.keys(searchQuery[0])
                .filter((key)=> key !== 'domain' && key!== 'generated' && key !== 'classification' && key !== 'version' && key !== 'source' && key !== 'id' && key !== 'case' && key !== 'plugin' && key !== 'hostname')
                .map((key)=>(
                    {field:key,headerName:key,flex:1}
                ))),setRunOnce(true))

        :null       
    }, [searchQuery])

    const columns2 = [
        {field:'ts',headerName:'TimeStamp',flex:1},
        {field:'path',headerName:'Path',flex:1},
    ]

    React.useEffect(()=>{
        let active = true;
        (
            async ()=>{
                console.log('Loading artefacts for source with filter Model: ',filterModel,' and pagination: ',paginationModel);
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
            const res = await  API.get('/api/sources/'+source.id_source+'/tasks/'+props.artefact.name)
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
                    API.get('/api/sources/'+source.id_source+'/artefacts/'+props.artefact.name+'/meilisearch',{
                        params:{
                            filter:filter.items.length == 0 ? defaultfilter : defaultfilter +' AND ' + ConvertOperator(filter),
                            q: filter.quickFilterValues !== undefined ? filter.quickFilterValues[0]:'',
                            offset:pagination.page*pagination.pageSize,
                            limit:pagination.pageSize
                        }
                    }).then(res=>{
                        setSearchQuery(res.data.hits);
                        
                    })
                },
            );
        })
    }
    
    return(
        <Card sx={{height:820,width:'inherit',flex:1,display:'flex',flexDirection:'column'}}>
             <DataGrid columns={columns} rows={searchQuery}
                getRowHeight={()=>'auto'}
                showToolbar
                key={'artefact-data-grid-'+props.source.id_source+'-'+props.id}
                //loading={loading}

                pagination
                paginationMode='server'
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                rowCount={-1}

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
                <Typography>{props.artefact.doc}</Typography> 
        </Card>

    )
}