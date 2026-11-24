// frontend/src/pages/yara.tsx
'use client'
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { PageContainer, useSessionStorageState } from '@toolpad/core';
import * as React from 'react';
import { FaLinux, FaWindows } from "react-icons/fa";
import { ExpandMore } from '@mui/icons-material';
import YaraDataGrid from '../components/yara/yaradatagrid';

export default function Yara(){
    const [listSources, setListSources] = useSessionStorageState('listsources', '[]')

    // FIX: defensive parse (a corrupt sessionStorage entry crashed the page)
    const sources: any[] = React.useMemo(() => {
        try { return JSON.parse(listSources || '[]') } catch { return [] }
    }, [listSources])

    return(
        <div style={{flex:0, border:0}} className='Yara'>
            <PageContainer>
                <Grid container spacing={1} direction={'column'}>
                    {
                        sources.map((src: any) => (
                            <Grid key={'grid-'+src.source_name} size={12}>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMore/>}>
                                        {/* FIX: <Button> used as an accordion title
                                            (misleading hover/focus) → proper
                                            typography + OS icon + plugin chips */}
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            {src.source_os === 'linux'
                                                ? <Tooltip title="Linux source"><FaLinux size={24}/></Tooltip>
                                                : <Tooltip title="Windows source"><FaWindows size={24}/></Tooltip>}
                                            <Typography variant="subtitle1" sx={{fontWeight: 500}}>
                                                {src.source_name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                YARA scans
                                            </Typography>
                                        </Stack>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <YaraDataGrid source={src}/>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        ))
                    }
                    {
                        sources.length === 0 && (
                            <Grid size={12}>
                                <Box sx={{py: 6, textAlign: 'center'}}>
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
