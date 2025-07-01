
"use client"
import { Button, Tooltip } from '@mui/material';
import * as React from 'react';
import API from '../api/axios'
import { CheckCircle,Error,NotStarted} from '@mui/icons-material';
import {  CircularProgress} from '@mui/material';

export default function Plugin(props:any){
    const [source,setSource] = React.useState(props.source)
    const [plugin,setPlugin] = React.useState(props.plugin)
    const [pluginStatus,setPluginStatus] = React.useState({task_status:'NOT FOUND'})

    React.useEffect(()=>{
            const fechData = async () =>{
              try {
                const res = await  API.get('/api/sources/'+source.id_source+'/tasks/'+plugin.name)
                setPluginStatus(res.data)
              } catch (error){
                console.error("Erreur lors de la récupération de la tache "+plugin.name, error)
              }
            };
            fechData();
    },[])

    React.useEffect(()=>{
        let interval = setInterval(()=>{
            pluginStatus.task_status !== 'SUCCESS' ? 
                pluginStatus.task_status !== 'FAILED' ? 
                    API.get('/api/sources/'+source.id_source+'/tasks/'+plugin.name).then(res=>setPluginStatus(res.data))
                :null
            :null
        },10000)

        return () => clearInterval(interval)

    },[])

    const onClickNotRun=()=>{
        pluginStatus.task_status === 'NOT FOUND' ?
        API.get('/api/sources/'+source.id_source+'/artefacts/'+plugin.name)
        .then(res=>API.get('/api/sources/'+source.id_source+'/tasks/'+plugin.name)
            .then(res=>(setPluginStatus(res.data)))):null
    }
    

    return(
        <Tooltip title={plugin.doc}>
            <Button endIcon={
                pluginStatus.task_status === 'NOT FOUND' ? 
                                    <NotStarted fontSize="large" color="primary" />
                                : pluginStatus.task_status === 'SUCCESS' ? 
                                    <CheckCircle fontSize="large" color="success" /> 
                                : pluginStatus.task_status === 'FAILED' ? 
                                    <Error fontSize="large" color="error"/>
                                : null
            }
                loading={pluginStatus.task_status === 'PENDING'}
                loadingPosition='end'
                onClick={onClickNotRun}
                color={pluginStatus.task_status === 'PENDING' ? 'primary' : pluginStatus.task_status === 'SUCCESS' ? 'success' : pluginStatus.task_status === 'FAILED' ? 'error' : 'inherit'}
            >
                {plugin.name}
            </Button>
        </Tooltip> 
    )
}