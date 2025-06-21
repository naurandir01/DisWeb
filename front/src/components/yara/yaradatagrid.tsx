'use client'
import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import API from '../api/axios'
import useSWR from 'swr';
import { useDialogs,useSessionStorageState,useNotifications } from '@toolpad/core';
import {  Box, Button, CircularProgress, Grid, MenuItem, TextField} from '@mui/material';
import YaraButton from './yarabutton';

const fetcher = (url: string) => API.get(url).then(res => res.data)

export default function YaraDataGrid(props: any){
    const [source,setSource] = React.useState(props.source)
    //const {data,error,isLoading} = useSWR('/api/sources/'+source.id_source+'/yara',fetcher)
    const [listYaraRules, setListYaraRules] = useSessionStorageState('listyararules','[]')
    const [currentYaraRule, setCurrentYaraRule] = React.useState({yararule_name:'',id_yararule:''})
    const [currentYaraRuleStatus, setCurrentYaraRuleStatus] = React.useState({task_status:''})
    const [currentYaraRuleResults, setCurrentYaraRuleResults] = React.useState<any>([])
    const notification = useNotifications()

    const [columns,setColumns] = React.useState([
        {field:'path',headerName:'Path',flex:1},
        {field:'rule',headerName:'Rule',flex:1},
        {field:'digest',headerName:'Hash',flex:1},
    ])

    React.useEffect(()=>{
        const fechData = async () =>{
            if(currentYaraRuleStatus.task_status === 'SUCCESS'){
                   try {
                const res = await  API.get('/api/sources/'+source.id_source+'/yara/'+currentYaraRule.id_yararule)
                setCurrentYaraRuleResults(res.data)
            
            } catch (error){
                    console.error("error when getting yara results", error)
                }
            }
         
        };
        fechData();
    },[currentYaraRuleStatus.task_status, currentYaraRule.id_yararule])

    React.useEffect(()=>{
        const fechData = async () =>{
            try {
                const res = await  API.get('/api/sources/'+source.id_source+'/tasks/yara_'+currentYaraRule.yararule_name)
                setCurrentYaraRuleStatus(res.data)
            } catch (error){
                notification.show('Error in getting YaraRule ' + currentYaraRule.yararule_name,{autoHideDuration:3000,severity:'error'})
            }
        };
        fechData();
    },[currentYaraRule])

    const handleStartYaraRule = ()=>{
        try {
            API.get('/api/sources/'+source.id_source+'/yara/'+currentYaraRule.id_yararule).then(res=>{
                notification.show('Succes in starting the YaraRule ' + currentYaraRule.yararule_name,{autoHideDuration:3000,severity:'success'})
            })
        } catch (error){
            notification.show('Error in starting YaraRule ' + currentYaraRule.yararule_name,{autoHideDuration:3000,severity:'error'})
        }
    }

    return(
        <Box sx={{height:830,width:'inherit',flex:1,display:'flex',flexDirection:'column'}}>
            {/* <YaraButton source={source} data={data}/> */}
            <Grid container sx={{justifyContent: "flex-start",alignItems: "center",}}>
                <Grid size={4}>
                    <TextField id="select-yara-rules" select label="Select Yara Rule" >
                        {JSON.parse(listYaraRules || '[]').map((rule: any) => 
                            <MenuItem key={rule.id_yararule} value={rule.id_yararule} onClick={()=>setCurrentYaraRule(rule)} >
                                {rule.yararule_name}
                            </MenuItem>
                        )}
                    </TextField>
                </Grid>
                <Grid size={4}>
                    <Box>
                        <Button disabled={currentYaraRuleStatus.task_status === 'SUCCESS'} onClick={handleStartYaraRule}> Run Yara Rule {currentYaraRule.yararule_name}</Button> 
                        {
                            currentYaraRuleStatus.task_status === "PENDING" && 
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                        }}
                                />
                        }
                    </Box>

                </Grid>
                <Grid size={12}>
                    <Box sx={{height:770,width:'inherit',flex:1,display:'flex',flexDirection:'column'}}>
                        <DataGrid
                            //loading={isLoading}
                            rows={currentYaraRuleResults}
                            columns={columns}
                            
                        />
                    </Box>  
                </Grid>
            </Grid>
        </Box>
    )
}