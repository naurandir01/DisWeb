'use client'
import * as React from 'react';
import API from '../api/axios'
import useSWR from 'swr';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { v4 } from 'uuid';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { Expand, ExpandMore } from '@mui/icons-material';

const fetcher = (url: string) => API.get(url).then(res =>res.data)

export default function Hayabusa(props: any){
    const [source,setSource] = React.useState(props.source)
    const {data,error,isLoading} = useSWR('/api/sources/'+source.id_source+'/artefacts/hayabusa',fetcher)

    const columns = [
        {field:'Timestamp',headerName:'Timestamp',flex:1},
        {field:'RuleTitle',headerName:'RuleTitle',flex:1},
        {field:'Level',headerName:'Level',flex:1},
        {field:'Channel',headerName:'Channel',flex:1},
        {field:'EventID',headerName:'EventID',flex:1},
        {field:'RecordID',headerName:'RecordID',flex:1},
        {field:'Details',headerName:'Details',flex:1,renderCell: (params: any)=>{
            return(
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore/>}>Details</AccordionSummary>
                <AccordionDetails>
                    {
                        Object.keys(params.value).map((key)=>{
                            return(
                                <Typography key={key}>{key}: {params.value[key]}</Typography>
                            )
                        })
                    }
                </AccordionDetails>
            </Accordion>)
        }},
    ]


    return(
        <Box sx={{width:2000,height:820}}>
           {
            !isLoading ? 
                <DataGrid
                    columns={columns}
                    rows={data.values}
                    loading={isLoading}
                    getRowId={()=> v4()}
                    initialState={{
                        pagination: {paginationModel:{pageSize:25}}
                    }}
                    getRowHeight={()=>'auto'}
                    slots={{toolbar:GridToolbar}}
                />
            :null
           }
        </Box>
    )
}