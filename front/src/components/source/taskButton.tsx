
"use client"
import * as React from 'react';
import { Button, CircularProgress, Grid} from '@mui/material';
import { useNotifications } from '@toolpad/core';
import API from "../api/axios"
import { CheckCircle, Error, NotStarted } from '@mui/icons-material';

export default function TaskButton(props:any){
    const notification = useNotifications()
    const [taskStatus,setTaskStatus] = React.useState({task_status:'NOT FOUND'})
  
    React.useEffect(()=>{
      const fechData = async () =>{
        try {
          const res = await  API.get('/api/sources/'+props.id+'/tasks/'+props.task.type)
          console.log('res',res.data)
          setTaskStatus(res.data)
        } catch (error){
          console.error("Erreur lors de la récupération de la tache "+props.task.type, error)
        }
      };
      fechData();
    },[])
  
    const executeTask=()=>{
      try {
        API.get('/api/sources/'+props.id+'/'+props.task.type).then(res=>{
          notification.show('Succes in starting the task ' + props.task.name,{autoHideDuration:3000,severity:'success'})
        })
      } catch (error){
        console.error("Error in starting the task "+props.task.type, error)
        notification.show('Error in the task ' + props.task.name ,{autoHideDuration:3000,severity:'error'})
      }
     
    }
    return(
      <Grid container direction="row" spacing={2} >
        <Button variant="contained" color="primary" onClick={executeTask} key={props.task.type} disabled={taskStatus.task_status === 'PENDING' || taskStatus.task_status === 'SUCCESS' || taskStatus.task_status === 'FAILED'}>
          {props.task.name} Plugin
        </Button>
        {
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
      </Grid>
      
    )
  }
  