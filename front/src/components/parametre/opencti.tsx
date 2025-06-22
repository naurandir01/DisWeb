'use client'
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Grid, TextField } from '@mui/material';
import * as React from 'react';

export default function OpenCti(){

    return(
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore/>}>OpenCTI</AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={3}>
                    <Grid>
                        <TextField label="URL"/>
                    </Grid>
                    <Grid>
                        <TextField label="API KEY"/>
                    </Grid>
                </Grid>
            </AccordionDetails>
            <AccordionActions>
                <Button>UPDATE</Button>
            </AccordionActions>
        </Accordion>
    )
}