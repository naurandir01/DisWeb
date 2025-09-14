'use client'
import { Grid } from '@mui/material';
import * as React from 'react';
import IocTypes from '../components/parametre/ioctype';
import IrisWeb from '../components/parametre/irisweb';
import OpenCti from '../components/parametre/opencti';
import YaraRules from '../components/parametre/yararules';
import { PageContainer } from '@toolpad/core';

export default function Parametres(props: any){
    return(
        <div style={{flex:0,border:0}} className='Parametres'>
            <PageContainer>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <IocTypes/>
                    </Grid>
                    <Grid size={12}>
                        <YaraRules/>
                    </Grid>
                    <Grid size={12}>
                        <IrisWeb/>
                    </Grid>
                    <Grid size={12}>
                        <OpenCti/>
                    </Grid>
                </Grid>
            </PageContainer>

        </div>
       
    )
}