'use client'
import * as React from 'react';
import API from '../api/axios'
import { useDialogs,useSessionStorageState,useNotifications } from '@toolpad/core';
import { DataGrid, GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import { Details, Edit } from '@mui/icons-material';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { Delete, ExpandMore } from '@mui/icons-material';
import {DialogProps } from '@toolpad/core/useDialogs';

function AddYaraRules({open,onClose}:DialogProps){
    const [newYaraRuleName,setNewYaraRuleName] = React.useState('')
    const [newYaraRuleDescription, setNewYaraRuleDescription] = React.useState('')
    const [listYaraRules, setListYaraRules] = useSessionStorageState('listyararules','[]')
    const [newYaraRuleContent, setNewYaraRuleContent] = React.useState('')
    const notification = useNotifications()

    const sendNewYaraRule= async()=>{
        try {
            const bodyformData = new FormData()
            bodyformData.append('yararule_name',newYaraRuleName)
            bodyformData.append('yararule_description',newYaraRuleDescription)
            bodyformData.append('yararule_content',newYaraRuleContent)
            const res = await API.post('/api/yara/',bodyformData,{headers:{'Content-Type':'multipart/form-data'}})
            notification.show("Yara Rule Add "+newYaraRuleName,{autoHideDuration:3000,severity:'success'})
            const res_2 = await API.get('/api/yara/').then(res=>setListYaraRules(JSON.stringify(res.data)))

        } catch (error){
            notification.show("Error in adding the new Yara Rule "+newYaraRuleName,{autoHideDuration:3000,severity:'error'})
        }
    }

    return(
        <Dialog fullWidth open={open} onClose={()=>onClose()} maxWidth={'md'}>
            <DialogTitle>Adding a new yara rule</DialogTitle>
            <DialogContent>
                <TextField label="Rule name" fullWidth variant='standard' value={newYaraRuleName} onChange={(event: any)=>setNewYaraRuleName(event.currentTarget.value)}/>
                <TextField label="Rule description" fullWidth variant='standard' value={newYaraRuleDescription} onChange={(event: any)=>setNewYaraRuleDescription(event.currentTarget.value)}/>
                <TextField label="Rule content" fullWidth variant='standard' multiline minRows={'10'} value={newYaraRuleContent} onChange={(event: any)=>setNewYaraRuleContent(event.currentTarget.value)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={sendNewYaraRule}> Add </Button>
                <Button onClick={()=> onClose()}> Stop </Button>
            </DialogActions>
        </Dialog>
    )

}


function YaraRuleDetails({payload,open,onClose}:DialogProps<any>){
    const [ yaraRuleContent, setYaraRuleContent] = React.useState('')

    React.useEffect(()=>{
            const fechData = async () =>{
              try {
                const res = await  API.get('/api/yara/'+payload.id_yararule)
                setYaraRuleContent(res.data.yararule_content)
              } catch (error){
                console.error("Error when get yara rule content", error)
              }
            };
            fechData();
    },[])

    const modifyYaraRule = async ()=>{
        try {
            const bodyformData = new FormData()
            bodyformData.append('yararule_content',yaraRuleContent)
            const res = await API.post('/api/yara/'+payload.id_yararule,bodyformData,{headers:{'Content-Type':'multipart/form-data'}})
            onClose()
        } catch (error){
            console.error("Error when modifying yara rule", error)
        }
    }


    return(
        <Dialog fullWidth open={open} onClose={()=>onClose()} maxWidth={'md'}>
            <DialogTitle>Yara rule detail</DialogTitle>
            <DialogContent>
                <TextField fullWidth variant='standard' multiline minRows={'10'} value={yaraRuleContent} onChange={(event:any)=>setYaraRuleContent(event.currentTarget.value)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={modifyYaraRule}>Modify</Button>
                <Button onClick={()=>onClose()}>Stop</Button>
            </DialogActions>
        </Dialog>
    )
}



export default function YaraRules(props: any){
    const dialog = useDialogs()
    const [listYaraRules, setListYaraRules] = useSessionStorageState('listyararules','[]')
    const notification = useNotifications()

    const columns: any = [
        {field:'yararule_name',headerName:'Yara Rule Name',flex: 1},
        {field:'yararule_description',headerName:'Description',flex: 1},
        {field:'action',type:'actions',getActions: (params: any)=>[
            <GridActionsCellItem
                icon={<Delete/>}
                label='Supprimer'
                onClick={onDeleteYaraRule(params.id)}
                key={'delete-ioc_type'}
            />,
            <GridActionsCellItem
                icon={<Edit/>}
                label='Details'
                key={'detail-yararules-'+params.id}
                onClick={async () => {await dialog.open(YaraRuleDetails,{id_yararule:params.id})}}
            />
        ]}
    ]

    function rowsId(row: any){
        return row.id_yararule
    }

    const onDeleteYaraRule = React.useCallback(
        (id:GridRowId)=> ()=>{
            API.delete('/api/yara/'+id).then(
            res=>{
                notification.show("Delete of Yara Rule",{autoHideDuration:3000,severity:'success'})  
                API.get('/api/yara/').then(res=>{
                setListYaraRules(JSON.stringify(res.data))
                }
                )
            }
            )
        },[notification,setListYaraRules]
    )

    return(
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore/>}> Yara Rules</AccordionSummary>
            <AccordionDetails>
                <DataGrid 
                    columns={columns} 
                    rows={JSON.parse(listYaraRules || '[]')} 
                    getRowId={rowsId}
                    initialState={{
                        pagination: {paginationModel:{pageSize:25}}
                    }}
                />
            </AccordionDetails>
            <AccordionActions>
                <Button onClick={async ()=>{ await dialog.open(AddYaraRules)}}>Add Yara Rule</Button>
            </AccordionActions>
        </Accordion>
    )

}