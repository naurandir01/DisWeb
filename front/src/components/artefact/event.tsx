'use client'
import { Box,Grid, Typography,Card, CardHeader, CardContent, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridRowModel, GridSortModel } from '@mui/x-data-grid';
import * as React from 'react';
import API from '../api/axios'
import meiliClient from '../api/meili';
import { CheckCircle,Error,EventNote,NotStarted} from '@mui/icons-material';
import {  CircularProgress} from '@mui/material';
import {  SearchResponse } from "meilisearch";
import { useSessionStorageState } from '@toolpad/core';

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

export default function Events(props: any){
    const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
    const [source,setSource] = React.useState(props.source)
    const [taskStatus,setTaskStatus] = React.useState({task_status:'NOT FOUND'})
    const [selectedRow,setSelectedRow] = React.useState<any>({});
    const [paginationModel,setPaginationModel] = React.useState<GridPaginationModel>({page:0,pageSize:100})
    const [filterModel,setfilterModel] = React.useState<GridFilterModel>({items:[],quickFilterValues:[]})
    const [sortModel,setSortModel] = React.useState<GridSortModel>([])
    
    const [searchQuery,setSearchQuery] = React.useState([])
    

    const defaultfilter = "source = '"+source.id_source+"' AND plugin = 'evtx'"

    const columns: GridColDef[] = [
        {field:'ts',headerName:'Timestamp',flex:1},
        {field:'Channel',headerName:'Channel',flex:1},
        {field:'EventID',headerName:'Event ID',flex:1},
        {field:'Level',headerName:'Level',flex:1},
        {field:'Opcode',headerName:'Opcode',flex:1},
        {field:'Version',headerName:'Version',flex:1},
    ]

    React.useEffect(()=>{
        const fechData = async () =>{
            try {
            const res = await  API.get('/api/sources/'+source.id_source+'/tasks/evtx')
            setTaskStatus(res.data)
            } catch (error){
            console.error("Erreur lors de la récupération de la tache evtx", error)
            }
        };
        fechData();
    },[])

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

    function loadArtefacts(pagination: GridPaginationModel,filter: GridFilterModel,sort:GridSortModel): Promise<any> {
            return new Promise((resolve) => {
                setTimeout(
                    ()=>{
                        API.get('/api/sources/'+source.id_source+'/artefacts/evtx/meilisearch',{
                            params:{
                                filter:filter.items.length == 0 ? defaultfilter : defaultfilter +' AND ' + ConvertOperator(filter),
                                q: filter.quickFilterValues !== undefined ? filter.quickFilterValues[0]:'',
                                offset:pagination.page*pagination.pageSize,
                                limit:pagination.pageSize}
                        }).then(res=>{
                            setSearchQuery(res.data.hits);
                        })
                    },
                );
            })
        }

    return(
        <Card sx={{height:1100,width:'inherit'}}>
            <CardHeader 
                avatar={
                        taskStatus.task_status === 'NOT FOUND' ? 
                            <NotStarted fontSize="large" color="primary" />
                        : taskStatus.task_status === 'PENDING' ? 
                            <CircularProgress size="30px"/>
                        : taskStatus.task_status === 'SUCCESS' ? 
                            <CheckCircle fontSize="large" color="success" /> 
                        : taskStatus.task_status === 'FAILED' ? 
                            <Error fontSize="large" color="error"/>
                        : null
                    }
                title="Events Logs"
                //action={
                //    <IconButton>
                //        <EventNote/>
                //    </IconButton>
                //}
            />
            <CardContent>
                <Grid container spacing={2}  sx={{justifyContent: "flex-start",alignItems: "flex-start",}}>
                    <Grid size={6}>
                        <div style={{height: 820, width:820}}>
                            <DataGrid
                                columns={columns}
                                rows={searchQuery}
                                getRowHeight={()=>'auto'}
                                
                                onRowClick={(params:any)=>{setSelectedRow(params.row)}}
                                showToolbar

                                paginationMode='server'
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                rowCount={-1}

                                filterMode='server'
                                onFilterModelChange={setfilterModel}
                                filterModel={filterModel}

                                sortingMode='server'
                                onSortModelChange={setSortModel}
                                sortModel={sortModel}
                            />
                        </div>
                    </Grid>
                    <Grid size={6}>
                        <Card sx={{width:820,minHeight:820}}>
                                <CardHeader title="Event Details:"/>
                                <CardContent>
                                    {
                                        Object.keys(selectedRow).filter((key)=>key !== 'id' && key !== 'domain' && key !== 'source')
                                        .map((key:any)=>{
                                            return(
                                                <Typography>{key}: {selectedRow[key]}</Typography>
                                            )
                                        })
                                    }
                                </CardContent>
                        </Card>
                    </Grid>
                </Grid>
           </CardContent>
           
        </Card>
    )

}