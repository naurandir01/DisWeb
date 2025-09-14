'use client'
import * as React from 'react';
import API from '../api/axios'
import { useDialogs,useSessionStorageState,useNotifications } from '@toolpad/core';
import {  Button,Checkbox, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemButton, ListItemIcon, ListItemText, DialogActions } from '@mui/material';
import {DialogProps } from '@toolpad/core/useDialogs';

function RunYaraRules({payload,open,onClose}:DialogProps<any>){
    const [listYaraRules, setListYaraRules] = useSessionStorageState('listyararules','[]')
    const [listYaraRulesToRun, setListYaraRulesToRun] = React.useState<Array<any>>([])
    const notification = useNotifications()

    const handleYaraRuleCheck = (value:any)=>()=>{
        
        const currentIndex = listYaraRulesToRun.indexOf(value);
        const newChecked = [...listYaraRulesToRun];
        if (currentIndex === -1) {
            newChecked.push(value);
        }
        else {
            newChecked.splice(currentIndex, 1);
        }
        setListYaraRulesToRun(newChecked);
    }

    const executeYara=()=>{
        listYaraRulesToRun.map((rule: any) => {
            try {
                API.get('/api/sources/'+payload.src.id_source+'/yara/'+rule).then(res=>{
                    notification.show('Succes in starting the YaraRule ' + rule,{autoHideDuration:3000,severity:'success'})
                })
            } catch (error){
                notification.show('Error in starting YaraRule ' + rule,{autoHideDuration:3000,severity:'error'})
            }
        })
    }

    return(
        <Dialog fullWidth open={open} onClose={()=>onClose()}>
            <DialogTitle>Yara Rules to Run</DialogTitle>
            <DialogContent>
                <List>
                    {JSON.parse(listYaraRules || '[]').map((rule: any) => 
                        {
                            
                            return(
                                <ListItem key={rule.id_yararule} >
                                    <ListItemButton role={undefined} onClick={handleYaraRuleCheck(rule.id_yararule)} dense>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={listYaraRulesToRun.includes(rule.id_yararule)}
                                                tabIndex={-1}
                                                disableRipple
                                                
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary={rule.yararule_name} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        }
                    )}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={executeYara}>Start</Button>
                <Button onClick={()=>onClose()}>Stop</Button>
            </DialogActions>
        </Dialog>
    )

}



export default function YaraButton(props: any){
    const [source,setSource] = React.useState(props.source)
    const [listYaraRules, setListYaraRules] = useSessionStorageState('listyararules','[]')
    const [listYaraRulesToRun, setListYaraRulesToRun] = React.useState([])
    const dialog = useDialogs()

    return(
        <Button onClick={async ()=>{await dialog.open(RunYaraRules,{src:source,data:props.data})}}> Yara Rule To Execute</Button>
    )

}