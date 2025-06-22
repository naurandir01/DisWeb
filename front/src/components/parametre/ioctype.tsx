'use client'
import { Delete, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, TextField } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import { useDialogs,useSessionStorageState,useNotifications } from '@toolpad/core';
import * as React from 'react';
import API from '../api/axios'


function AddIOC({open,onClose= ()=>{}}:DialogProps){
    const [newType,setNewType] = React.useState('')
    const [newTypeDescription, setNewTypeDescription] = React.useState('')
    const [listIocType, setListIocType] = useSessionStorageState('listioctype','[]')
    const notification = useNotifications()

    const sendNewIOCType= async()=>{
        try {
            const bodyformData = new FormData()
            bodyformData.append('ioc_type_value',newType)
            bodyformData.append('ioc_type_description',newTypeDescription)
            const res = await API.post('/api/iocs_types/',bodyformData,{headers:{'Content-Type':'multipart/form-data'}})
            notification.show("Adding a new IOC type "+newType,{autoHideDuration:3000,severity:'success'})
            const res_2 = await API.get('/api/iocs_types').then(res=>setListIocType(JSON.stringify(res.data)))

        } catch (error){
            notification.show("Error when adding a new ioc type"+newType,{autoHideDuration:3000,severity:'error'})
        }

        onClose({},'backdropClick')
    }

    return(
        <Dialog fullWidth open={open} onClose={()=>onClose({},'backdropClick')}>
            <DialogTitle>Add IOC TYPE</DialogTitle>
            <DialogContent>
                <TextField label="New Type" fullWidth variant='standard' value={newType} onChange={(event: any)=>setNewType(event.currentTarget.value)}/>
                <TextField label="Description" fullWidth variant='standard' value={newTypeDescription} onChange={(event: any)=>setNewTypeDescription(event.currentTarget.value)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={sendNewIOCType}> Ajouter </Button>
                <Button onClick={()=> onClose({},'backdropClick')}> Annuler </Button>
            </DialogActions>
        </Dialog>
    )
}


export default function IocTypes(props: any){
    const dialog = useDialogs()
    const [listIocType, setListIocType] = useSessionStorageState('listioctype','[]')
    const notification = useNotifications()

    const columns: any = [
        {field:'ioctype_value',headerName:'IOC Type',flex: 1},
        {field:'ioctype_description',headerName:'Description',flex: 1},
        {field:'action',type:'actions',getActions: (params: any)=>[
            <GridActionsCellItem
                icon={<Delete/>}
                label='Delete'
                onClick={onDeleteSource(params.id)}
                key={'delete-ioc_type'}
            />
        ]}
    ]

    const onDeleteSource = React.useCallback(
        (id:GridRowId)=> ()=>{
          API.delete('/api/iocs_types/'+id).then(
            res=>{
                notification.show("Deletion of the IOC Type",{autoHideDuration:3000,severity:'success'})  
              API.get('/api/iocs_types/').then(res=>{
                setListIocType(JSON.stringify(res.data))
              }
              )
            }
          )
        },[notification,setListIocType]
      )


    function rowsId(row: any){
        return row.id_ioctype
    }

    return(
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore/>}> IoC Type</AccordionSummary>
            <AccordionDetails>
                <div style={{height:'400px',width:'100%'}}>
                    <DataGrid 
                    columns={columns} 
                    rows={JSON.parse(listIocType || '[]')} 
                    getRowId={rowsId}
                    initialState={{
                        pagination: {paginationModel:{pageSize:25}}
                    }}
                    showToolbar
                />
                </div>
                
            </AccordionDetails>
            <AccordionActions>
                <Button onClick={async ()=>{ await dialog.open(AddIOC)}}>Add new IOC TYPE</Button>
            </AccordionActions>
        </Accordion>
    )
}