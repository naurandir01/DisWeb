
"use client"
import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import {DialogProps } from '@toolpad/core/useDialogs';
import Plugin from './plugin';
import { useSessionStorageState, useNotifications } from '@toolpad/core';
import API from '../api/axios'


const plugins_not_to_show_list = [
    'mft_timeline','yara','mft','activity','os','ips','hostname','version','architecture',
    'example_yield','example_none','example_record','example','loaders','plugins','walkfs',
    'timezone','language','ntversion','domain','keys','pathenvironment','qfind',"_dpapi_keyprovider_keychain.keys",
    "_dpapi_keyprovider_lsa_defaultpassword.keys","_dpapi_keyprovider_credhist.keys","_dpapi_keyprovider_empty.keys",'regf'
]

export default function Plugins({payload,open,onClose}:DialogProps<any>){ {
      const [listSources,setListSources] = useSessionStorageState('listsources','[]')

      const notification = useNotifications()

      const onClickAllRun=()=>{
          JSON.parse(listSources || '[]').find((src:any)=> src.id_source === payload.src.row.id_source).source_plugins
          .filter((plugin: any) =>!plugins_not_to_show_list.includes(plugin.name))
          .map((plugin:any)=>{
            API.get('/api/sources/'+payload.src.row.id_source+'/artefacts/'+plugin.name)
          })
          notification.show('All plugins that have not been run have started',{autoHideDuration:3000,severity:'info'})
      }
  return(
    <Dialog fullWidth open={open} onClose={()=>onClose()} maxWidth='xl'>
      <DialogTitle>List of plugins</DialogTitle>
      <DialogContent>
         <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
             {
                          JSON.parse(listSources || '[]').find((src:any)=> src.id_source === payload.src.row.id_source).source_plugins
                          .filter((plugin: any) =>!plugins_not_to_show_list.includes(plugin.name))
                          .sort((a:any,b:any)=>a.name.localeCompare(b.name,undefined,{sensivity:'base'}))
                          .map((plugin:any)=>{
                            return(
                              <Grid size={4}>
                                <Plugin source={payload.src.row} plugin={plugin}/>
                              </Grid>
                            )
                          })
                        }
         </Grid>
        
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickAllRun}>RUN ALL</Button>
        <Button onClick={()=>onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}}
