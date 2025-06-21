'use client'
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns=[
    {field:'start',headerName:'Start',minWidth:60,sortable: false, resizable: false, filterable: false},
    {field:'1',headerName:'01',width:60,sortable: false, resizable: false, filterable: false},
    {field:'2',headerName:'02',width:60,sortable: false, resizable: false, filterable: false},
    {field:'3',headerName:'03',width:60,sortable: false, resizable: false, filterable: false},
    {field:'4',headerName:'04',width:60,sortable: false, resizable: false, filterable: false},
    {field:'5',headerName:'05',width:60,sortable: false, resizable: false, filterable: false},
    {field:'6',headerName:'06',width:60,sortable: false, resizable: false, filterable: false},
    {field:'7',headerName:'07',width:60,sortable: false, resizable: false, filterable: false},
    {field:'8',headerName:'08',width:60,sortable: false, resizable: false, filterable: false},
    {field:'9',headerName:'09',width:60,sortable: false, resizable: false, filterable: false},
    {field:'10',headerName:'10',width:60,sortable: false, resizable: false, filterable: false},
    {field:'11',headerName:'A',width:60,sortable: false, resizable: false, filterable: false},
    {field:'12',headerName:'B',width:60,sortable: false, resizable: false, filterable: false},
    {field:'13',headerName:'C',width:60,sortable: false, resizable: false, filterable: false},
    {field:'14',headerName:'D',width:60,sortable: false, resizable: false, filterable: false},
    {field:'15',headerName:'E',width:60,sortable: false, resizable: false, filterable: false},
    {field:'contenue',headerName:'Fichier',flex:1,sortable: false}
]


export default function DisplayFileHex(props: any){


    const columnsHexDump = [
        {field:'address',headerName:"Address",flex:1},
        {field:'hexvalue',headerName:'Hex Value',flex:1},
        {field:'string',headerName:'String Value',flex:1},
    ]

    return(
        <div>
            <DataGrid
                    columns={columnsHexDump}
                    rows={props.rows}
                    disableColumnMenu 
                    rowHeight={25}
                    getRowId={(row) => row.address}
                    initialState={{
                        pagination: {paginationModel:{pageSize:25}}
                    }}
                    showToolbar
                />
        </div>
    )
}