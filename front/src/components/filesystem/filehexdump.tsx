'use client'
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

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