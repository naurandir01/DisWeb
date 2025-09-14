"use client"
import * as React from 'react';
import { useSessionStorageState } from '@toolpad/core';
import API from '../api/axios'
import { BarChart } from '@mui/x-charts';
import { Grid, IconButton } from '@mui/material';
import {  Replay } from '@mui/icons-material';

export default function ChronologieGraph(props: any){
    const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
    const [listSources,setListSources] = useSessionStorageState('listsources','[]')

    const [dataset,setDataSet] = React.useState<any[]>([])
    const [isLoading,setIsLoading] = React.useState(false)
    const [selectedTimeStamp,setSelectedTimeStamp] = React.useState('')

    const [srcisousDataSet,setPrevisousDataSet] = React.useState<any[]>([])
    const [srcisousTimeStamp,setPrevisousTimeStamp] = React.useState<any>([])

    function getGraphData(): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(
                () => {
                    setIsLoading(true)

                    API.get('/api/cases/'+JSON.parse(currentCas||'{}').id_case+'/timeline/timestamp/').then(res=>{
                        setDataSet(res.data)
                        setIsLoading(false)
                    }); 
                }
            );
    
        })
    }

    React.useEffect(() => {
        let active = true;
        (
            async () => {
                const newsrows = await getGraphData();
                if (!active) {
                    return;
                }
            }
        )()
    },[])

    function getGraphDataByTimeStamp(): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(
                () => {
                    setIsLoading(true)
                    API.get('/api/cases/'+JSON.parse(currentCas||'{}').id_case+'/timeline/timestamp/'+selectedTimeStamp).then(res=>{
                        setDataSet(res.data)
                        setIsLoading(false)
                    }); 
                }
            );
    
        })
    }

    React.useEffect(() => {
        let active = true;
        (
            async () => {
                const newsrows = await getGraphDataByTimeStamp();
                if (!active) {
                    return;
                }
            }
        )()
    },[selectedTimeStamp])
    

    const onClick=(event: any,params: any)=>{
        setPrevisousTimeStamp([...srcisousTimeStamp,selectedTimeStamp])
        setSelectedTimeStamp(params.axisValue.toString())
        props.setTimeStampGlobal(params.axisValue.toString())
    }

    const onBefore=()=>{
        if(srcisousTimeStamp.length !== 0){
            let newTimeStamp = srcisousTimeStamp.pop()
            setSelectedTimeStamp(newTimeStamp)
            props.setTimeStampGlobal(newTimeStamp)
        }
    }

    return(
        <div>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <IconButton onClick={onBefore}><Replay /></IconButton>
                </Grid>
                <Grid size={12}>
                    <BarChart
                        dataset={dataset}
                        xAxis={[{dataKey:'ts',scaleType:'band'}]}
                        series={[{dataKey:'count',label:'Evenements'}]}
                        height={280}
                        width={2200}
                        
                        //onItemClick={onClick}
                        onAxisClick={onClick}
                        />
                </Grid>
            </Grid>
        </div>
    )
}