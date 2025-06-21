'use client'
import { Accordion, AccordionDetails, AccordionSummary, Button,Grid} from '@mui/material';
import { PageContainer, useSessionStorageState } from '@toolpad/core';
import * as React from 'react';
import { FaLinux, FaWindows } from "react-icons/fa";
import { ExpandMore } from '@mui/icons-material';
import Artefact from '../components/artefact/artefact';

export default function Artefacts(){
    const [listSources,setListSources] = useSessionStorageState('listsources','[]')
    return(
        <div style={{flex:0,border:0}} className='Artefact'>
            <PageContainer>
                <Grid container spacing={1} direction={'column'}>
                {
                    listSources !== null ? JSON.parse(listSources).map((src: any)=>{
                        return(
                            <Grid key={'grid-'+src.source_name} size={12} >
                                <Accordion >
                                    <AccordionSummary expandIcon={<ExpandMore/>}>
                                        <Button startIcon={src.source_os === 'linux' ? <FaLinux size={30}/>: <FaWindows size={30}/>} key={'icon-'+src.name}>{src.source_name}</Button>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Artefact source={src}/>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        )
                    }):null
                }
                </Grid>
            </PageContainer>
       
        </div>
    )
}