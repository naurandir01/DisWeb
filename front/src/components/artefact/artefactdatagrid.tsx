'use client'
import {  Card, Typography } from '@mui/material';
import { DataGrid, GridColDef} from '@mui/x-data-grid';
import * as React from 'react';
import API from '../api/axios'
import useSWR from 'swr';
import { CheckCircle,Error,NotStarted} from '@mui/icons-material';
import {  CircularProgress} from '@mui/material';
import MuiPagination from '@mui/material/Pagination';

const fetcher = (url: string) => API.get(url).then(res => res.data)


export default function ArtefactDataGrid(props: any){
    const [source,setSource] = React.useState(props.source)
    const [artefactName,setArtefactName] = React.useState(props.id)
    const {data,error,isLoading} = useSWR('/api/sources/'+source.id_source+'/artefacts/'+props.artefact.name,fetcher)
    const [taskStatus,setTaskStatus] = React.useState({task_status:'NOT FOUND'})

    const columns: GridColDef[] = React.useMemo(()=>{
        return isLoading ? []:
            data.pending ? []:
                data.values.length === 0 ? []:
                    Object.keys(data.values[0]).
                        filter((key)=> key !== 'domain' && key!== 'generated' && key !== 'classification' && key !== 'version' && key !== 'source' && key !== 'id')
                        .map((key)=>(
                            {
                                field: key,
                                headerName: key,
                                flex:1
                            }
                        )
                    )
    }, [data])

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


    return(
        <Card sx={{height:820,width:'inherit',flex:1,display:'flex',flexDirection:'column'}}>
            <DataGrid columns={columns} rows={isLoading ? []:data.values}
                getRowHeight={()=>'auto'}
                showToolbar
                loading={isLoading ? true : data.pending}
                initialState={{
                    pagination: {paginationModel:{pageSize:25}}
                }}
                key={'artefact-data-grid-'+props.source.id_source+'-'+props.id}
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