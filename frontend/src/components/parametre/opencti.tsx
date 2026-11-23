// frontend/src/components/parametre/opencti.tsx
'use client'
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Alert, Button, Grid, TextField } from '@mui/material';
import * as React from 'react';
import useIsAdmin from '../api/useIsAdmin';

export default function OpenCti(){
    const [isAdmin] = useIsAdmin()

    return(
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore/>}>OpenCTI</AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={3}>
                    <Grid>
                        <TextField label="URL" disabled={!isAdmin}/>
                    </Grid>
                    <Grid>
                        <TextField label="API KEY" disabled={!isAdmin}/>
                    </Grid>
                </Grid>
            </AccordionDetails>
            {!isAdmin && (
                <Alert severity="info" sx={{mx:2}}>
                    Administrator role required to edit OpenCTI settings.
                </Alert>
            )}
            <AccordionActions>
                <Button disabled={!isAdmin}>UPDATE</Button>
            </AccordionActions>
        </Accordion>
    )
}
