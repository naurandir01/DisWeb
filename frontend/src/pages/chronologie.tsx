// frontend/src/pages/chronologie.tsx
'use client'
import * as React from 'react';
import ChronologieDataGrid from '../components/chronologie/chronologieDataGrid';
import { Alert, Grid, Stack, Typography } from '@mui/material';
import ChronologieGraph from '../components/chronologie/chronologieGraph';
import { PageContainer } from '@toolpad/core';

export default function Chronologie(){
    const [currentTimeStampGlobal, setCurrentTimeStampGlobal] = React.useState<string>('')

    return(
        <div style={{flex: 0, border: 0}} className='Chronologie'>
            <PageContainer>
                <Stack sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        Click a bar to drill down (years → months → days → hours → minutes);
                        the grid below follows the selected period.
                    </Typography>
                </Stack>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <ChronologieGraph
                            setTimeStampGlobal={setCurrentTimeStampGlobal}
                        />
                    </Grid>
                    <Grid size={12}>
                        <ChronologieDataGrid
                            currentTimeStampGlobal={currentTimeStampGlobal}
                            onClearTimeStampGlobal={() => setCurrentTimeStampGlobal('')}
                        />
                    </Grid>
                </Grid>
            </PageContainer>
        </div>
    )
}
