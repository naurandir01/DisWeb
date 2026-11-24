// frontend/src/components/filesystem/filecontent.tsx
'use client'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Alert, Box, CircularProgress, Stack, Tab, Typography } from '@mui/material';
import * as React from 'react';
import DisplayFileHex from './filehexdump';
import API from '../api/axios'
import FileString from './filestring';
import FileMetadata from './filemetadata';
import FileDisplay from './filedisplay';
import { fsAPI } from '../api/api';

function splitFile(file: string, taille: number){
    let sousFile = []
    for (let i = 0; i < file.length; i += taille){
        sousFile.push(file.substring(i, i + taille));
    }
    return sousFile
}

export default function FileContent(props: any){
    const [plugin, setPlugin] = React.useState('1');
    const [currentFile, setCurrentFile] = React.useState('');
    const [currentFileProps, setCurrentFileMetadata] = React.useState({path:''});
    const [currentFileType, setCurrentFileType] = React.useState('')
    const [currentFileHexDump, setCurrentFileHexDump] = React.useState<any[]>([])

    // UX: loading + error states (none existed; fetching a large binary
    // from an image can take several seconds with zero feedback)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string|null>(null)

    const handleChangePlugin = (event: React.SyntheticEvent, newValue: string)=>{
        setPlugin(newValue)
    }
    const [listPlugin] = React.useState([
        {label:'HEXDUMP', value:'1'},
        {label:'STRING', value:'2'},
        {label:'METADATA', value:'3'},
        {label:'DISPLAY', value:'4'},
    ])

    React.useEffect(()=>{
        if(props.currentFile.path !== currentFileProps.path){
            setCurrentFileMetadata(props.currentFile)
            setError(null)

            if(props.currentFile.type === 'fls'){
                setIsLoading(true)
                const filePath = encodeURIComponent(props.currentFile.path)   // FIX: encode spaces/& in paths
                const fechData = async () => {
                    try {
                        const res = await API.get('/sources/'+props.id_source+'/fs/get_file?file_path='+filePath)
                        if (res.data !== 'Not Found'){
                            setCurrentFileType(
                                typeof res.headers['content-type'] === 'string'
                                    ? res.headers['content-type'] as string
                                    : 'application/octet-stream'
                            )
                            setCurrentFile(res.data)
                        } else {
                            setError('File not found in the evidence image.')
                        }
                    } catch (e) {
                        setError('Failed to read the file from the evidence image.')
                    } finally {
                        setIsLoading(false)
                    }
                }
                fechData();
            }
        }
    },[props.currentFile, currentFileProps.path])

    React.useEffect(()=>{
        if(props.currentFile.path !== currentFileProps.path){
            if(props.currentFile.type === 'fls'){
                const filePath = encodeURIComponent(props.currentFile.path)
                const fechData = async () => {
                    try {
                        const res = await fsAPI.getFileHexdump(props.id_source, filePath)
                        if (res.data !== 'Not Found'){
                            setCurrentFileHexDump(res.data)
                        }
                    } catch (e) {
                        setError('Failed to read the hexdump of the file.')
                    }
                }
                fechData();
            }
        }
    },[props.currentFile, currentFileProps.path])

    const hasFile = props.currentFile.path !== '';

    return(
        <Box>
            <TabContext value={hasFile ? plugin : ''}>
                <Box>
                    <TabList onChange={handleChangePlugin}>
                    {
                        listPlugin.map((p, index)=>(
                            // Tabs disabled until a file is selected (before:
                            // all tabs were clickable on an empty viewer)
                            <Tab label={p.label} value={p.value} key={index} disabled={!hasFile}/>
                        ))
                    }
                    </TabList>
                </Box>
                {error && <Alert severity="error" sx={{mb:1}} onClose={()=>setError(null)}>{error}</Alert>}
                {isLoading && (
                    <Stack sx={{py:8}} alignItems="center">
                        <CircularProgress size={28}/>
                        <Typography variant="caption" color="text.secondary" sx={{mt:1}}>
                            Reading file from the evidence image…
                        </Typography>
                    </Stack>
                )}
                <TabPanel value={'1'} sx={{display: !hasFile || isLoading ? 'none' : undefined}}>
                    <DisplayFileHex rows={currentFileHexDump}/>
                </TabPanel>
                <TabPanel value={'2'} sx={{display: !hasFile || isLoading ? 'none' : undefined}}>
                    <FileString file={splitFile(currentFile, 2500)} file_metadata={props.currentFile} id_source={props.id_source}/>
                </TabPanel>
                <TabPanel value={'3'} sx={{display: !hasFile || isLoading ? 'none' : undefined}}>
                    <FileMetadata file={props.currentFile} id_source={props.id_source}/>
                </TabPanel>
                <TabPanel value={'4'} sx={{display: !hasFile || isLoading ? 'none' : undefined}}>
                    <FileDisplay file={props.currentFile} type={currentFileType} id_source={props.id_source}/>
                </TabPanel>
            </TabContext>
        </Box>
    )
}
