'use client'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, FormControlLabel, MenuItem, Switch, TextField } from '@mui/material';
import React from 'react';
import { useDialogs, useSessionStorageState,useNotifications, PageHeaderToolbar } from '@toolpad/core';
import API from '../api/axios'

function CasDialog({open,onClose= () => {}}:DialogProps){
    const [listSourceNotLink,setListSourceNotLink] = React.useState([])
    const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
    const [sourceToLink,setSourceToLink] = React.useState('')
    const [isencrypted,setIsEncrypted] = React.useState(false)
    const [key_type,setKeyType] = React.useState('none')
    const [key_value,setKeyValue] = React.useState('')
    const [listSources,setListSources] = useSessionStorageState('listsources','')
    const notification = useNotifications()

    const Creation= async ()=>{
        try {
            const bodyformData = new FormData()
            bodyformData.append('src_case',currentCas || '')
            bodyformData.append('src_path',sourceToLink)
            bodyformData.append('crypt_key_type',key_type)
            bodyformData.append('crypt_key_value',key_value)
            const res = await API.post('/api/sources/',bodyformData,{headers:{'Content-Type':'multipart/form-data'}})
            const res_2 = await API.get('/api/cases/'+JSON.parse(currentCas|| '{}').id_case+'/sources').then(res=>{
                setListSources(JSON.stringify(res.data))
            })
            notification.show('Source '+sourceToLink +' link',{autoHideDuration:3000,severity:'success'})
        }catch(error){
            notification.show("Error when adding a new source "+sourceToLink,{autoHideDuration:3000,severity:'error'})
        }
        onClose({},'backdropClick')
    }

    React.useEffect(()=>{
        const fechData = async ()=>{
            try {
                const res = await API.get('/api/cases/'+JSON.parse(currentCas|| '{}').id_case+'/sources/add')
                setListSourceNotLink(res.data)
            } catch (error){
                console.error("Erreur when getting sources not link:",error)
            }
        };fechData();
    },[currentCas])

    const handleIsEncryptedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsEncrypted(event.target.checked);
    }
    

    return(
        <Dialog fullWidth open={open} onClose={()=> onClose({},'backdropClick')}>
            <DialogTitle> ADD NEW SOURCE</DialogTitle>
            <DialogContent>
                <DialogContentText> Liste of source not link</DialogContentText>
                <TextField id="listSourceNonLier" select fullWidth
                    helperText="Select a new source"
                    onChange={(event: any)=>setSourceToLink(event.target.value)}
                >
                    {
                        listSourceNotLink.map((src)=>(
                            <MenuItem key={src} value={src}>{src}</MenuItem>
                        ))
                    }
                </TextField>
                <FormControlLabel
                    control={<Switch checked={isencrypted} onChange={handleIsEncryptedChange} />}
                    label="Is the source encrypted ? It support Luks and Bitlocker encryption."
                />
                {
                    isencrypted &&
                    <Box>
                        <TextField id="key_type" select fullWidth
                            helperText="Select the type of key"
                            onChange={(event: any)=>setKeyType(event.target.value)}
                        >
                            <MenuItem value='PASSPHRASE'>PASSPHRASE</MenuItem>
                            <MenuItem value='RECOVERY_KEY'>RECOVERY_KEY</MenuItem>
                        </TextField>
                        <TextField id="crypt_key" fullWidth
                            helperText="Add the decrypt key"
                            onChange={(event: any)=>setKeyValue(event.target.value)}
                        />
                    </Box>
               
                }
               
            </DialogContent>
            <DialogActions>
                <Button onClick={Creation}>ADD</Button>
                <Button onClick={()=>onClose({},'backdropClick')}>STOP</Button>
            </DialogActions>
        </Dialog>
    )
}

export default function CustomToolBarSource(){
    const dialog = useDialogs()
    return(
        <PageHeaderToolbar>
            <Button variant='outlined' onClick={async () =>{
                    await dialog.open(CasDialog)
                }}> ADD NEW SOURCE
            </Button>
        </PageHeaderToolbar>
    )
  }
  