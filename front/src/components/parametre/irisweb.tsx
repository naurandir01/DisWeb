'use client'
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Grid, TextField } from '@mui/material';
import * as React from 'react';

export default function IrisWeb(){

    return(
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore/>}>Iris-Web</AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={3}>
                    <Grid>
                        <TextField label="URL"/>
                    </Grid>
                    <Grid>
                        <TextField label="API"/>
                    </Grid>
                </Grid>
            </AccordionDetails>
            <AccordionActions>
                <Button>Mettre à jour</Button>
            </AccordionActions>
        </Accordion>
    )
}