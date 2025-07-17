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
    const [children,setChildren] = React.useState([])
    const {data,error,isLoading} = useSWR('/api/sources/'+props.src.id_source+'/fs/get_directory?volume='+props.volume.number+'&directory='+item.path,fetcher)

    const handleChildren=()=>{
        props.setDirectorySrc(props.src.id_source)
    }

    return(
        <TreeItem 
            itemId={'/api/sources/'+props.src.id_source+'/fs/get_directory?volume='+props.volume.number+'&directory='+item.path} 
            label={data !== undefined ? 
                    data.pending ? 
                        item.name
                        :item.name + ' ('+data.values.length+')' 
                    : item.name} 
            onClick={handleChildren}
            
            id={uuidv4()} 
            key={uuidv4()}>
            {
                data === undefined ? null: data.values
                    .sort((a: any,b:any)=>a.name.localeCompare(b.name,undefined,{sensivity:'base'}))
                    .map((child: any,index: any)=>{
                    return(
                        child.type === 'drc' ? <CustomeTreeViews item={child} volume={props.volume} src={props.src} onLoading={props.onLoading} onDirectoryContent={props.onDirectoryContent} setDirectorySrc={props.setDirectorySrc}/>:null
                    )
                })
            }
        </TreeItem>
    )
}

export default function Arboresence(props: any){
    const [listVolumes,setListVolumes] = React.useState([])
    const [currentDirectory,setCurrentDirectory] = React.useState('')
    const {data,error,isLoading} = useSWR('/api/sources/'+props.src.id_source+'/fs/volumes',fetcher)

    const handleItelSelection = (event: React.SyntheticEvent | null,itemId: string,isSelected:boolean)=>{
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
                    <SimpleTreeView slots={{collapseIcon:Folder,expandIcon:CreateNewFolder,endIcon:Folder}} sx={{marginTop:1.5}} onItemSelectionToggle={handleItelSelection}>
                        {
                            data !== undefined ? data
                                .sort((a: any,b:any)=>a.name.localeCompare(b.name,undefined,{sensivity:'base'}))
                                .map((volume: any,index: any)=>{
                                    return(
                                        <CustomeTreeViews item={{name:volume.name,path:'',type:'drc'}} src={props.src} volume={volume} onLoading={props.onLoading} onDirectoryContent={props.onDirectoryContent} key={'custom-tree-'+volume.name} setDirectorySrc={props.setDirectorySrc}/>
                                    )
                                }):null
                        }
                    </SimpleTreeView>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}