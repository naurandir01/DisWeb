// frontend/src/components/filesystem/filehexdump.tsx
'use client'
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export default function DisplayFileHex(props: any){

    const columnsHexDump: GridColDef[] = [
        // Monospace + no-wrap: hex dumps are meaningless when wrapped or
        // displayed in a proportional font
        { field: 'address', headerName: "Address", width: 130,
          renderCell: (params) => (
              <Typography variant="body2" fontFamily="monospace">{params.row.address}</Typography>
          ) },
        { field: 'hexvalue', headerName: 'Hex Value', flex: 1, minWidth: 400,
          renderCell: (params) => (
              <Typography variant="body2" fontFamily="monospace" sx={{whiteSpace:'nowrap'}}>
                  {params.row.hexvalue}
              </Typography>
          ) },
        { field: 'string', headerName: 'ASCII', flex: 1, minWidth: 250,
          renderCell: (params) => (
              // ASCII column highlighted: most forensic reading happens here
              <Typography variant="body2" fontFamily="monospace" color="text.secondary"
                          sx={{whiteSpace:'nowrap'}}>
                  {params.row.string}
              </Typography>
          ) },
    ]

    return(
        <Box sx={{height: 640}}>
            <DataGrid
                columns={columnsHexDump}
                rows={props.rows}
                disableColumnMenu
                rowHeight={22}
                getRowId={(row) => row.address}
                initialState={{
                    pagination: {paginationModel:{pageSize:100}}
                }}
                showToolbar
                // Virtualization handles long files; denser pagination than the
                // old 25/page for actual hex reading
                localeText={{ noRowsLabel: 'No hex data available' }}
            />
        </Box>
    )
}
