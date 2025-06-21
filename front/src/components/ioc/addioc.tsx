import React from 'react';
import API from '../api/axios'
import { useSessionStorageState,useNotifications } from '@toolpad/core';
import {Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, MenuItem, TextField } from '@mui/material';

export function IocDialog({open,onClose= () => {}}:DialogProps){
    const [ioc_type,setIocType] = React.useState('')
    const [ioc_value,setIocValue] = React.useState('')
    const [ioc_src,setIocSrc] = React.useState('')
    const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
    const [listSources,setListSources] = useSessionStorageState('listsources','[]')
    const [listIocType, setListIocType] = React.useState([])
    const notification = useNotifications()

    const AddIOC= async ()=>{
        try{
            const bodyformData = new FormData()
            bodyformData.append('ioc_case',currentCas !== null ? JSON.parse(currentCas).id_case:'')
            bodyformData.append('ioc_type',ioc_type !== null ? ioc_type:'')
            bodyformData.append('ioc_value',ioc_value !== null ?ioc_value:'')
            bodyformData.append('ioc_src',ioc_src !== null ?ioc_src:'')
            const res = await API.post('/api/iocs/',bodyformData,{headers:{'Content-Type':'multipart/form-data'}})
            notification.show("IOC add "+ioc_value,{autoHideDuration:3000,severity:'success'})
        }catch(error){
            notification.show("Error when adding "+ioc_value,{autoHideDuration:3000,severity:'error'})
        }
        onClose({},'backdropClick')
    }

    React.useEffect(()=>{
        const fechData = async () =>{
          try {
            const res = await  API.get('/api/iocs_types/')
            setListIocType(res.data)
          } catch (error){
            console.error("Error when getting the liste of IOC types :", error)
          }
        };
        fechData();
    },[])


    return(
        <Dialog fullWidth open={open} onClose={()=>onClose({},'backdropClick')}>
            <DialogTitle> ADD AN IOC</DialogTitle>
            <DialogContent>
                <TextField id='ioc_src' fullWidth label="Source" defaultValue={''} onChange={(event: any)=>setIocSrc(event.target.value)} variant='standard' select>
                    {
                        listSources !== undefined ? JSON.parse(listSources || '[]').map((value: any)=>(
                            <MenuItem key={value.id_source} value={value.id_source}>
                                {value.source_name}
                            </MenuItem>
                        )):null
                    }
                </TextField>
                <TextField id='ioc_type' fullWidth label="Type" defaultValue={''} onChange={(event: any)=>setIocType(event.target.value)} variant='standard' select>
                    {
                        listIocType.map((value: any)=>(
                            <MenuItem key={value.ioctype_value} value={value.ioctype_value}>
                                {value.ioctype_value}
                            </MenuItem>
                        ))
                    }
                </TextField>
                <TextField id='ioc_value' fullWidth label="Value" value={ioc_value} onChange={(event: any)=>setIocValue(event.currentTarget.value)} variant='standard'/>
            </DialogContent>
            <DialogActions>
                <Button onClick={AddIOC}>ADD</Button>
                <Button onClick={()=>onClose({},'backdropClick')}>STOP</Button>
            </DialogActions>
        </Dialog>
    )
}
