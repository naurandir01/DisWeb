'use client'
import { Download } from '@mui/icons-material';
import { Button } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import * as React from 'react';
import API from '../api/axios'
import { useNotifications } from '@toolpad/core';
import JSZip from 'jszip'
import { v4 as uuidv4 } from 'uuid';

export default function DirectoryContent(props: any){
    const notification = useNotifications()

    const columns: any = [
        {field:'name',headerName:'Name',flex:1,renderCell:(params: any)=>{
            return <Button size='small' variant='text' onClick={()=>params.row.type === 'fls' ? props.onSetFile(params.row):null}>{params.row.name}</Button>
        }},
        {field:'type',headerName:'Type',width:60},
        {field:'subtype',headerName:'Extension',flex:1},
        {field:'btime',headerName:'Creation (B)',flex:1, type: 'dateTime',valueGetter:(value: number)=> value && new Date(value/1000000)},
        {field:'ctime',headerName:'Modification (M)',flex:1, type: 'dateTime',valueGetter:(value: number)=> value && new Date(value/1000000)},
        {field:'atime',headerName:'Access (A)',flex:1, type: 'dateTime',valueGetter:(value: number)=> value && new Date(value/1000000)},
        {field:'mtime',headerName:'Metadata (C)',flex:1,type: 'dateTime',valueGetter:(value: number)=> value && new Date(value/1000000)},
        {field:'sha256',headerName:'SHA 256',flex:1},
        {field:'size',headerName:'Size',flex:1},
        {field:'actions',type: 'actions',getActions:(params: any)=>[
            <GridActionsCellItem
                icon={<Download/>}
                label='Download'
                onClick={handleGetFile(params.row,props.id_source)}
                key={'file-download'}
            />,
        ]},
    ]

    const getRowsId=(row: any)=>{
        return uuidv4()
    }

    const handleGetFile=React.useCallback(
        (row: any,id_source: any)=> ()=>{
            try{
                notification.show("Download of the file "+row.path,{autoHideDuration:3000,severity:'success'})
                API.get('/api/sources/'+id_source+'/fs/get_file?volume='+row.volume+'&file_path='+row.path,{responseType:'blob'}).then(
                    async res=>{
                        const file_blob = new Blob([res.data], {type: res.headers['content-type']})
                        const zip = new JSZip()
                        zip.file(row.name, file_blob)
                        const zipBlob = await zip.generateAsync({ type: 'blob' });
                        const url = URL.createObjectURL(zipBlob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = row.name+'.zip'
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        URL.revokeObjectURL(url)
                        
                    }
                )
            } catch (error){
                notification.show("Error when downloading the file",{autoHideDuration:3000,severity:'error'})
            }
        },[notification]
    )

    return(
        <div style={{height:700}}>
            <DataGrid 
                rows={props.rows} 
                columns={columns} 
                rowHeight={25} 
                getRowId={getRowsId} 
                showToolbar
                loading={props.loading}
                initialState={{
                    pagination: {paginationModel:{pageSize:25}}
                }}
            />
        </div>
    )
}