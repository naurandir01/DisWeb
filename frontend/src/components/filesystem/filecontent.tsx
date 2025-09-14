'use client'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import * as React from 'react';
import DisplayFileHex from './filehexdump';
import API from '../api/axios'
import FileString from './filestring';
import FileMetadata from './filemetadata';
import FileDisplay from './filedisplay';

function splitFile(file: string,taille: number){
    let sousFile = []
    for (let i =0;i<file.length;i+= taille){
        sousFile.push(file.substring(i,i+taille));
    }
    return sousFile
}

export default function FileContent(props: any){
    const [plugin, setPlugin] = React.useState('1');
    const [currentFile, setCurrentFile] = React.useState('');
    const [currentFileProps, setCurrentFileMetadata] = React.useState({path:''});
    const [currentFileType,setCurrentFileType] = React.useState('')
    const [currentFileHexDump,setCurrentFileHexDump] = React.useState([])

    const handleChangePlugin=(event: React.SyntheticEvent,newValue: string)=>{
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
            if(props.currentFile.type === 'fls'){
                const fechData = async ()=>{
                    const res = await API.get('/api/sources/'+props.id_source+'/fs/get_file?file_path='+props.currentFile.path)
                    if (res.data !== 'Not Found'){
                        setCurrentFileType(res.headers['content-type'])
                        setCurrentFile(res.data)
                    }
                };fechData();
            }
        }
    },[props.currentFile, currentFileProps.path])

        React.useEffect(()=>{
        if(props.currentFile.path !== currentFileProps.path){
            if(props.currentFile.type === 'fls'){
                const fechData = async ()=>{
                    const res = await API.get('/api/sources/'+props.id_source+'/fs/get_file_hexdump?file_path='+props.currentFile.path)
                    if (res.data !== 'Not Found'){
                        setCurrentFileHexDump(res.data)
                    }
                };fechData();
            }
        }
    },[props.currentFile, currentFileProps.path])

    return(
        <Box>
            <TabContext value={plugin}>
                <Box>
                    <TabList onChange={handleChangePlugin}>
                    {
                            listPlugin.map((plugin,index)=>{
                                return(
                                    <Tab label={plugin.label} value={plugin.value} key={index}/>
                                )
                            })
                        }
                    </TabList>
                </Box>
                <TabPanel value={'1'}>
                    <DisplayFileHex rows={currentFileHexDump}/>
                </TabPanel>
                <TabPanel value={'2'}>
                    <FileString file={splitFile(currentFile,2500)} file_metadata={props.currentFile} id_source={props.id_source}/>
                </TabPanel>
                <TabPanel value={'3'}>
                    <FileMetadata file={props.currentFile} id_source={props.id_source}/>
                </TabPanel>
                <TabPanel value={'4'}>
                    <FileDisplay file={props.currentFile} type={currentFileType} id_source={props.id_source}/>
                </TabPanel>
            </TabContext>
        </Box>
    )
}