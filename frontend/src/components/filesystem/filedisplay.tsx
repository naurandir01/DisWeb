// frontend/src/components/filesystem/filedisplay.tsx
'use client'
import { Alert, Box, Card, CircularProgress, Typography } from '@mui/material';
import * as React from 'react';
import API from '../api/axios';
import useSWR from 'swr';
import ImageDisplay from './type/image';
import XMLPDFDisplay from './type/xml_pdf';
import SQLiteDIsplay from './type/sql';

const fetcher2 = async (url: string) => {
    const response = await API.get(url, { responseType: 'blob' });
    const contentType = typeof response.headers['content-type'] === 'string'
        ? response.headers['content-type'] as string
        : 'application/octet-stream'
    return { data: response.data, type: contentType }
}

// Viewer routing by file extension — kept as a declarative map for easy growth
const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'svg', 'ico', 'gif', 'bmp', 'webp'];
const DOC_EXT = ['xml', 'pdf', 'html', 'txt', 'log', 'json'];

export default function FileDisplay(props: any){
    const file_path = props.file?.path ?? '';
    const url = '/sources/'+props.id_source+'/fs/get_file?file_path='+encodeURIComponent(file_path)
    const shouldFetch = file_path !== '';
    const { data, error, isLoading } = useSWR(shouldFetch ? url : null, fetcher2)

    // FIX: path.split('.') crashed on files without extension (undefined.pop);
    // also compute the extension once, null-safely
    const fileExtension = (file_path.split('.').pop() ?? '').toLowerCase();

    // Blob URLs must be revoked — the original created a new one on every
    // render without cleanup (memory leak: one leaked Blob per re-render)
    const [blobUrl, setBlobUrl] = React.useState<string | null>(null)
    React.useEffect(()=>{
        if (data) {
            const url = URL.createObjectURL(new Blob([data.data], { type: data.type }))
            setBlobUrl(url)
            return () => URL.revokeObjectURL(url)
        }
        setBlobUrl(null)
    }, [data])

    if (!file_path) {
        return null;
    }

    return(
        <Card>
            <Box sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 320px)' }}>
                {
                    isLoading ?
                        (<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>) :
                    error ?
                        (<Alert severity="error">Failed to load the file from the evidence image.</Alert>) :
                    blobUrl === null ?
                        null :
                    IMAGE_EXT.includes(fileExtension) ?
                        (<ImageDisplay file={blobUrl} />) :
                    DOC_EXT.includes(fileExtension) ?
                        (<XMLPDFDisplay file={blobUrl} ext={fileExtension} />) :
                    fileExtension === 'db3' || fileExtension === 'db' || fileExtension === 'sqlite' ?
                        (<SQLiteDIsplay file={props.file} id_source={props.id_source} />)
                    : (<Box sx={{ p: 4, textAlign: 'center' }}>
                           <Typography color="text.secondary">
                               No inline viewer for «&nbsp;{fileExtension}&nbsp;» files. Use the HEXDUMP or STRING tab to inspect the content.
                           </Typography>
                       </Box>)
                }
            </Box>
        </Card>
    )
}
