'use client'
import { Accordion, AccordionDetails, AccordionSummary, Button, Chip, CircularProgress } from '@mui/material';
import * as React from 'react';
import API from '../api/axios'
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { CreateNewFolder, ExpandMore, Folder } from '@mui/icons-material';
import { FaLinux, FaWindows } from 'react-icons/fa';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';

const fetcher = (url: string) => API.get(url).then(res => res.data)

function CustomeTreeViews(props: any){
    const [item,setItem] = React.useState(props.item)
    const defaultfilter = 'source = "'+props.src.id_source+'" AND parent = "'+item.path+'" AND plugin = "fs"'
    
    const {data,error,isLoading} = useSWR(`/api/sources/${props.src.id_source}/fs/get_directory?directory=${item.path}&filter=${defaultfilter}`,fetcher)

    const handleChildren=()=>{
        props.setDirectorySrc(props.src.id_source)
    }

    const handleSelect=()=>{
        console.log('Selected ',item.path)
    }

    return(
        <TreeItem 
            itemId={`/api/sources/${props.src.id_source}/fs/get_directory?directory=${item.path}&filter=${defaultfilter}`} 
            label={data !== undefined ? 
                    data.pending ? 
                        item.name
                        :item.name + ' ('+data.values.length+')' 
                    : item.name} 
            onClick={handleChildren}
            onSelect={handleSelect}
            
            id={item.id} 
            key={item.id}>
            {
                data === undefined ? null: data.values
                    .sort((a: any,b:any)=>a.name.localeCompare(b.name,undefined,{sensivity:'base'}))
                    .filter((item: any)=>item.type === 'drc')
                    .map((child: any,index: any)=>{
                    return(
                        
                         <CustomeTreeViews item={child} volume={props.volume} src={props.src} onLoading={props.onLoading} onDirectoryContent={props.onDirectoryContent} setDirectorySrc={props.setDirectorySrc}/>
                    )
                })
            }
        </TreeItem>
    )
}

export default function Arboresence(props: any){
    const [currentDirectory,setCurrentDirectory] = React.useState('')
    const defaultfilter = 'source = "'+props.src.id_source+'" AND parent = "/" AND plugin = "fs"'
    const {data,error,isLoading} = useSWR(`/api/sources/${props.src.id_source}/fs/get_directory?directory=/&filter=${defaultfilter}`,fetcher)

    const handleItemSelection = (event: React.SyntheticEvent | null,itemId: string,isSelected:boolean)=>{
        if(isSelected){
            setCurrentDirectory(itemId);
        }
    }

    React.useEffect(()=>{
        API.get(currentDirectory).then(res=>{
             props.onDirectoryContent(res.data.values)
             props.onLoading(isLoading)
         })
        
    }, [currentDirectory])


    return (
        <div>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore/>}>
                    <Button startIcon={props.src.source_os === 'linux' ? <FaLinux size={30}/>: <FaWindows size={30}/>} key={'icon-'+props.src.source_name}>{props.src.source_name}</Button>
                </AccordionSummary>
                <AccordionDetails>
                    <SimpleTreeView slots={{collapseIcon:Folder,expandIcon:CreateNewFolder,endIcon:Folder}} sx={{marginTop:1.5}} onItemSelectionToggle={handleItemSelection}>
                        { 
                            data !== undefined ? data.values
                                .sort((a: any,b:any)=>a.name.localeCompare(b.name,undefined,{sensivity:'base'}))
                                .filter((item: any)=>item.type === 'drc')
                                .map((dir: any,index: any)=>{
                                    return(
                                        <CustomeTreeViews item={{name:dir.name,path:dir.path,type:'drc'}} src={props.src} onLoading={props.onLoading} onDirectoryContent={props.onDirectoryContent} key={'custom-tree-'+dir.name} setDirectorySrc={props.setDirectorySrc}/>
                                    )
                                }):null
                        } 
                    </SimpleTreeView>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}