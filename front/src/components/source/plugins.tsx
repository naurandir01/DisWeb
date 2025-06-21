
"use client"
import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';
import TaskButton from './taskButton';
import {DialogProps } from '@toolpad/core/useDialogs';

export default function Plugins({payload,open,onClose}:DialogProps<any>){ {
  const [listTasksWindows] = React.useState([{'type':'hayabusa','name':'Hayabusa'},{'type':'regf','name':'Registre'},{'type':'timeline','name':'Chronologie'}])
  const [listTasksLinux] = React.useState([{'type':'timeline','name':'CHRONOLOGIE'}])

  return(
    <Dialog fullWidth open={open} onClose={()=>onClose()}>
      <DialogTitle>Liste des plugins</DialogTitle>
      <DialogContent>
        <Stack  sx={{ justifyContent: "flex-start", alignItems: "flex-start",}}>
          {
            payload.src.row.source_os === 'windows' ? (
                <Grid container direction="column" spacing={2} >
                  {
                    listTasksWindows.map((task:any)=>{
                      return(
                        <TaskButton task={task} id={payload.src.id}/>
                      )
                    })
                  }
                </Grid>
              
            ): 
                <Grid container direction="column" spacing={2} >
                {
                  listTasksLinux.map((task:any)=>{
                    return(<TaskButton task={task} id={payload.src.id}/>)
                  })
                }
              </Grid>
          }
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>onClose()}>Fermer</Button>
      </DialogActions>
    </Dialog>
  )}}
