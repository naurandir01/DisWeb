// frontend/src/components/filesystem/directorycontent.tsx
'use client'
import { Description, Download, Folder } from '@mui/icons-material';
import 'react-data-grid/lib/styles.css';

import { Button, Stack, Tooltip, Typography } from '@mui/material';
import {DataGrid, GridActionsCell, GridActionsCellItem, GridColDef} from '@mui/x-data-grid';
import * as React from 'react';
import API from '../api/axios'
import { useNotifications } from '@toolpad/core';
import JSZip from 'jszip'
import { fsAPI } from '../api/api';

// Human-readable file size
function formatSize(bytes: any): string {
    if (bytes === null || bytes === undefined || bytes === '') return '-';
    const b = Number(bytes);
    if (isNaN(b)) return String(bytes);
    const units = ['B','KB','MB','GB','TB'];
    let i = 0, v = b;
    while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
    return `${v >= 10 || i === 0 ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
}

export default function DirectoryContent(props: any){
    const notification = useNotifications()

    const handleGetFile = React.useCallback(
        (row: any, id_source: any) => async () => {
            // FIX: the entire download chain is now awaited so that a failed
            // request actually shows the error notification (the try/catch
            // previously only guarded the synchronous part).
            try {
                const res = await fsAPI.getFile(id_source, row.path)
                const contentType = typeof res.headers['content-type'] === 'string'
                    ? res.headers['content-type'] as string
                    : 'application/octet-stream'
                const file_blob = new Blob([res.data], { type: contentType })
                const zip = new JSZip()
                zip.file(row.name, file_blob)
                const zipBlob = await zip.generateAsync({ type: 'blob' })
                const url = URL.createObjectURL(zipBlob)
                const a = document.createElement('a')
                a.href = url
                a.download = row.name + '.zip'
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
                notification.show("Download of the file " + row.path, {autoHideDuration: 3000, severity: 'success'})
            } catch (error) {
                notification.show("Error when downloading the file", {autoHideDuration: 3000, severity: 'error'})
            }
        },
        [notification]
    )

    const columns: GridColDef[] = [
        {
            field: 'name', headerName: 'Name', flex: 1, minWidth: 220,
            renderCell: (params: any) => (
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{minWidth:0}}>
                    {params.row.type === 'drc'
                        ? <Folder fontSize="small" sx={{color:'primary.main', flexShrink:0}}/>
                        : <Description fontSize="small" sx={{flexShrink:0}}/>}
                    <Button
                        size='small'
                        variant='text'
                        sx={{justifyContent:'flex-start', minWidth:0, textTransform:'none'}}
                        onClick={() => params.row.type === 'fls' ? props.onSetFile(params.row) : null}>
                        <Typography variant="body2" noWrap sx={{textAlign:'left'}}>{params.row.name}</Typography>
                    </Button>
                </Stack>
            ),
        },
        { field: 'subtype', headerName: 'Type (magic)', flex: 1, minWidth: 150,
          renderCell: (params: any) => (
              <Tooltip title={params.row.subtype || ''}>
                  <Typography variant="caption" noWrap>{params.row.subtype || '-'}</Typography>
              </Tooltip>
          ) },
        { field: 'btime', headerName: 'Creation (B)', flex: 1, type: 'dateTime',
          valueGetter: (value: number) => value && new Date(value/1000000) },
        { field: 'mtime', headerName: 'Modified (M)', flex: 1, type: 'dateTime',
          valueGetter: (value: number) => value && new Date(value/1000000) },
        { field: 'ctime', headerName: 'Metadata (C)', flex: 1, type: 'dateTime',
          valueGetter: (value: number) => value && new Date(value/1000000) },
        { field: 'atime', headerName: 'Access (A)', flex: 1, type: 'dateTime',
          valueGetter: (value: number) => value && new Date(value/1000000) },
        { field: 'size', headerName: 'Size', width: 100,
          valueGetter: (_v, row: any) => row.size,
          valueFormatter: (value: any) => formatSize(value) },
        { field: 'sha256', headerName: 'SHA-256', width: 140,
          renderCell: (params: any) => params.row.sha256 ? (
              <Tooltip title={params.row.sha256}>
                  <Typography variant="caption" fontFamily="monospace">
                      {params.row.sha256.substring(0,12)}…
                  </Typography>
              </Tooltip>
          ) : '-' },
        { field: 'actions', type: 'actions', renderCell: (params) => (
            params.row.type === 'fls'
                ? <GridActionsCell {...params}>
                    <GridActionsCellItem
                      icon={<Download/>}
                      label='Download'
                      onClick={handleGetFile(params.row, props.id_source)}
                      key={'file-download'}
                    />
                </GridActionsCell>
                : []
            )},
    ]

    return(
        <div style={{height:700}}>
            <DataGrid
                rows={props.rows}
                columns={columns}
                rowHeight={28}
                showToolbar
                loading={props.loading}
                getRowClassName={(params: any) => params.row.type === 'drc' ? 'dir-row' : ''}
                sx={{ '& .dir-row': { backgroundColor: 'rgba(0,0,0,0.02)' } }}
                localeText={{ noRowsLabel: props.loading
                    ? 'Loading directory content…'
                    : 'Select a directory in the tree to list its content' }}
                initialState={{
                    pagination: {paginationModel:{pageSize:25}}
                }}
            />
        </div>
    )
}
