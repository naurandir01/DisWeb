'use client'
import {  Card, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridRowModel, GridSortModel} from '@mui/x-data-grid';
import * as React from 'react';
import meiliClient from '../api/meili';
import { useSessionStorageState } from '@toolpad/core';
import { CheckCircle,Error,NotStarted} from '@mui/icons-material';
import { CircularProgress} from '@mui/material';
import { SearchResponse } from "meilisearch";

export default function ArtefactDataGrid(props: any){
    const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
    const [source,setSource] = React.useState(props.source)
    const [searchQuery,setSearchQuery] = React.useState<SearchResponse>({hits:[],offset:0,limit:100,processingTimeMs:0,query:'',totalHits:0})
    const [taskStatus,setTaskStatus] = React.useState({task_status:'NOT FOUND'})
    const [paginationModel,setPaginationModel] = React.useState<GridPaginationModel>({page:0,pageSize:100})
    const [filterModel,setfilterModel] = React.useState<GridFilterModel>({items:[]})
    const [sortModel,setSortModel] = React.useState<GridSortModel>([])
 
    const columns: GridColDef[] = React.useMemo(()=>{
        return searchQuery.hits.length > 0 ? Object.keys(searchQuery.hits[0])
                .filter((key)=> key !== 'domain' && key!== 'generated' && key !== 'classification' && key !== 'version' && key !== 'source' && key !== 'id' && key !== 'case' && key !== 'plugin' && key !== 'hostname')
                .map((key)=>(
                    {field:key,headerName:key,flex:1}
                ))
        :[]
                
    }, [searchQuery])

    React.useEffect(()=>{
        const fetchSource = async () => {
            try{
                const res = await meiliClient.index(JSON.parse(currentCas ||'{}').case_name+'_artefacts').search('',
                    {
                        filter:"source = '"+source.id_source+"' AND plugin = '"+props.artefact.name+"'",
                        limit: paginationModel.pageSize,
                        offset: paginationModel.page * paginationModel.pageSize,
                    })
                setSearchQuery(res)
            } catch (error) {
                console.error("Erreur lors de la récupération de la source", error)
            }
        };fetchSource()
    },[paginationModel])

    React.useEffect(()=>{
        (
            async ()=>{
                console.log('Sort model changed',sortModel)
            }
        )();
    },[sortModel])

    
    return(
        <Card sx={{height:820,width:'inherit',flex:1,display:'flex',flexDirection:'column'}}>
             <DataGrid columns={columns} rows={searchQuery.hits}
                getRowHeight={()=>'auto'}
                showToolbar
                key={'artefact-data-grid-'+props.source.id_source+'-'+props.id}

                paginationMode='server'
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                rowCount={searchQuery.estimatedTotalHits}

                filterMode='server'
                onFilterModelChange={setfilterModel}
                filterModel={filterModel}

                sortingMode='server'
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