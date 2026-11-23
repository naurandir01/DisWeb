"use client"
import * as React from 'react';
import { PageContainer, useSessionStorageState } from '@toolpad/core';
import { Grid, Accordion, AccordionDetails, AccordionSummary, Button } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { FaLinux, FaWindows } from "react-icons/fa";
import YaraDataGrid from '../components/yara/yaradatagrid';

export default function Yara(){
    const [listSources,setListSources] = useSessionStorageState('listsources','[]')

    return(
        <div style={{flex:0,border:0}} className='Yara'>
            <PageContainer>
                <Grid container spacing={1} direction={'column'}>
                    {
                        listSources !== null ? JSON.parse(listSources).map((src: any)=>{
                                return (<Grid key={'grid-'+src.source_name} size={12} >
                                    <Accordion >
                                        <AccordionSummary expandIcon={<ExpandMore/>}>
                                            <Button startIcon={src.source_os === 'linux' ? <FaLinux size={30}/>: <FaWindows size={30}/>} key={'icon-'+src.name}>{src.source_name}</Button>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <YaraDataGrid source={src}/>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>)
                        }):null
                    }
                </Grid>
            </PageContainer>
        </div>
    )
}