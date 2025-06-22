'use client'
import { Box, Card, CircularProgress } from '@mui/material';
import * as React from 'react';
import API from '../api/axios';
import useSWR from 'swr';
import ImageDisplay from './type/image';
import XMLPDFDisplay from './type/xml_pdf';
import SQLiteDIsplay from './type/sql';

const fetcher2 = async (url:string)=>{
    const response = await API.get(url, { responseType: 'blob' });
    return { data:response.data,type: response.headers['content-type']}
}

export default function FileDisplay(props: any){
    const {data,error,isLoading} = useSWR('/api/sources/'+props.id_source+'/fs/get_file?volume='+props.file.volume+'&file_path='+props.file.path,fetcher2)
    const fileExtension = props.file.path.split('.').pop().toLowerCase();

    const convertToUrl=(file_data:any)=>{
        const blob = new Blob([file_data.data], { type: file_data.type });
        return URL.createObjectURL(blob)
    }

    return(
        <Card>
            <Box sx={{overflowY: 'scroll'}}>
                {
                    isLoading ? 
                        (<CircularProgress/>): 
                    error ? 
                        (<p>Error loading image</p>):
                    fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'svg' || fileExtension === 'ico' ? 
                        (<ImageDisplay file={convertToUrl(data)}/>):
                    fileExtension === 'xml' || fileExtension === 'pdf'|| fileExtension === 'html' ? 
                        (<XMLPDFDisplay file={convertToUrl(data)}/>):
                    fileExtension === 'db3' ? 
                        (<SQLiteDIsplay file={props.file}/>)
                    : (<p>File not supported for display, more will come</p>)
                }
            </Box>
        </Card>
       
    )
}