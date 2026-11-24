// frontend/src/pages/artefact.tsx
'use client'
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { PageContainer, useSessionStorageState } from '@toolpad/core';
import * as React from 'react';
import { FaLinux, FaWindows } from "react-icons/fa";
import { ExpandMore } from '@mui/icons-material';
import Artefact from '../components/artefact/artefact';

export default function Artefacts(){
    const [listSources,setListSources] = useSessionStorageState('listsources','[]')
    const sources: any[] = listSources ? JSON.parse(listSources) : [];

    return(
        <div style={{flex:0,border:0}} className='Artefact'>
            <PageContainer>
                <Grid container spacing={1} direction={'column'}>
                {
                    sources.map((src: any)=>{
                        const isWindows = src.source_os === 'windows';
                        return(
                            <Grid key={'grid-'+src.source_name} size={12} >
                                <Accordion >
                                    <AccordionSummary expandIcon={<ExpandMore/>} sx={{alignItems:'center'}}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ml:0.5}}>
                                            {/* OS icon without button semantics (was a
                                                <Button> used as an accordion title:
                                                confusing hover/focus behaviour) */}
                                            {isWindows
                                                ? <Tooltip title="Windows source"><FaWindows size={26}/></Tooltip>
                                                : <Tooltip title="Linux source"><FaLinux size={26}/></Tooltip>}
                                            <Typography variant="subtitle1" sx={{fontWeight:500}}>
                                                {src.source_name}
                                            </Typography>
                                            {src.source_type && (
                                                <Chip label={String(src.source_type).toUpperCase()} size="small" variant="outlined"/>
                                            )}
                                            {Array.isArray(src.source_plugins) && (
                                                <Chip
                                                    size="small"
                                                    label={`${src.source_plugins.length} plugins`}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            )}
                                            {src.source_version && (
                                                <Tooltip title="Image version">
                                                    <Chip size="small" label={`v${src.source_version}`} variant="outlined"/>
                                                </Tooltip>
                                            )}
                                        </Stack>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Artefact source={src}/>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        )
                    })
                }
                {
                    sources.length === 0 && (
                        <Grid size={12}>
                            <Box sx={{py:6, textAlign:'center'}}>
                                <Typography color="text.secondary">
                                    No source available. Add a source to a case first.
                                </Typography>
                            </Box>
                        </Grid>
                    )
                }
                </Grid>
            </PageContainer>

        </div>
    )
}
