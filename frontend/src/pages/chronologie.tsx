"use client"
import * as React from 'react';
import ChronologieDataGrid from '../components/chronologie/chronologieDataGrid';
import { Grid } from '@mui/material';
import ChronologieGraph from '../components/chronologie/chronologieGraph';
import { PageContainer } from '@toolpad/core';

export default function Chronologie(){

    const [min_max,setTimestamp] = React.useState<{min:Date,max:Date}>({min:new Date(),max:new Date()})
    const [currentTimeStampGlobal,setCurrentTimeStampGlobal] = React.useState<string>('')

    return(
        <div style={{flex:0,border:0}} className='Chronologie'>
            <PageContainer>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <ChronologieGraph min_max={min_max} setTimeStampGlobal={setCurrentTimeStampGlobal}/>
                    </Grid>
                    <Grid size={12}>
                        <ChronologieDataGrid min_max={min_max} currentTimeStampGlobal={currentTimeStampGlobal}/>
                    </Grid>
                </Grid>
            </PageContainer>
          
        </div>  
        
    )
}