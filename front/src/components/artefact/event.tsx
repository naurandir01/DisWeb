'use client'
import { Box,Grid, Typography,Card, CardHeader, CardContent, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridRowModel, GridSortModel } from '@mui/x-data-grid';
import * as React from 'react';
import API from '../api/axios'
import meiliClient from '../api/meili';
import useSWR from 'swr';
import { CheckCircle,Error,EventNote,NotStarted} from '@mui/icons-material';
import {  CircularProgress} from '@mui/material';
import {  SearchResponse } from "meilisearch";
import { useSessionStorageState } from '@toolpad/core';

const fetcher = (url: string) => API.get(url).then(res => res.data)

export default function Events(props: any){
    const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
    const [source,setSource] = React.useState(props.source)
    //const {data,error,isLoading} = useSWR('/api/sources/'+source.id_source+'/artefacts/evtx',fetcher)
    const [taskStatus,setTaskStatus] = React.useState({task_status:'NOT FOUND'})
    const [selectedRow,setSelectedRow] = React.useState<any>({});

    const [paginationModel,setPaginationModel] = React.useState<GridPaginationModel>({page:0,pageSize:100})
    const [filterModel,setfilterModel] = React.useState<GridFilterModel>({items:[]})
    const [sortModel,setSortModel] = React.useState<GridSortModel>([])
    const [searchQuery,setSearchQuery] = React.useState<SearchResponse>({hits:[],offset:0,limit:100,processingTimeMs:0,query:'',totalHits:0})
    
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
        const fetchSource = async () => {
            try{
                const res = await meiliClient.index(JSON.parse(currentCas ||'{}').case_name+'_artefacts').search('',
                    {
                        filter:"source = '"+source.id_source+"' AND plugin = 'evtx'",
                        limit: paginationModel.pageSize,
                        offset: paginationModel.page * paginationModel.pageSize,
                    })
                setSearchQuery(res)
            } catch (error) {
                console.error("Erreur lors de la récupération de la source", error)
            }
        };fetchSource()
    },[paginationModel])

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
                action={
                    <IconButton>
                        <EventNote/>
                    </IconButton>
                }
            />
            <CardContent>
                <Grid container spacing={2}  sx={{justifyContent: "flex-start",alignItems: "flex-start",}}>
                    <Grid size={6}>
                        <div style={{height: 820, width:820}}>
                            <DataGrid
                                columns={columns}
                                rows={searchQuery.hits}
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