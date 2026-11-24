// frontend/src/components/filesystem/arborescense.tsx
'use client'
import { Accordion, AccordionDetails, AccordionSummary, Chip, CircularProgress, Stack, Tooltip, Typography } from '@mui/material';
import * as React from 'react';
import API from '../api/axios'
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { CreateNewFolder, ExpandMore, Folder, FolderOpen, Warning } from '@mui/icons-material';
import { FaLinux, FaWindows } from 'react-icons/fa';
import useSWR from 'swr';
import { fsAPI } from '../api/api';

const fetcher = (url: string) => API.get(url).then(res => res.data)

function CustomeTreeViews(props: any){
    const [item] = React.useState(props.item)
    const defaultfilter = 'source = "'+props.src.id_source+'" AND parent = "'+item.path+'" AND plugin = "fs"'

    const url = `/sources/${props.src.id_source}/fs/get_directory?directory=${encodeURIComponent(item.path)}&filter=${encodeURIComponent(defaultfilter)}`
    const {data, error, isLoading} = useSWR(url, fetcher)

    const handleClick=()=>{
        // Selecting a node loads its listing in the right-hand panel
        props.setDirectorySrc(props.src.id_source)
        props.onDirectoryFetch(url)
    }

    // FIX: 'sensivity' typo → 'sensitivity' (case-insensitive sort now works)
    const childrenDirs = data !== undefined && !data.pending
        ? data.values
            .filter((child: any) => child.type === 'drc')
            .sort((a: any, b: any) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
        : []

    return(
        <TreeItem
            itemId={url}
            label={
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="body2">{item.name}</Typography>
                    {/* Indexing feedback (backend returns pending:true when the
                        directory task was just launched) */}
                    {data?.pending && <CircularProgress size={12}/>}
                    {error && <Tooltip title="Failed to load children"><Warning fontSize="small" color="error"/></Tooltip>}
                    {!data?.pending && childrenDirs.length > 0 &&
                        <Chip size="small" label={childrenDirs.length} variant="outlined" sx={{height:18, minWidth:24}}/>}
                </Stack>
            }
            onClick={handleClick}
            id={item.id}
            key={item.id}>
            {
                childrenDirs.map((child: any)=>(
                    <CustomeTreeViews
                        item={child}
                        volume={props.volume}
                        src={props.src}
                        onLoading={props.onLoading}
                        onDirectoryContent={props.onDirectoryContent}
                        onDirectoryFetch={props.onDirectoryFetch}
                        setDirectorySrc={props.setDirectorySrc}
                        key={'tree-'+child.id}
                    />
                ))
            }
        </TreeItem>
    )
}

export default function Arboresence(props: any){
    const defaultfilter = 'source = "'+props.src.id_source+'" AND parent = "/" AND plugin = "fs"'
    const rootUrl = `/sources/${props.src.id_source}/fs/get_directory?directory=/&filter=${encodeURIComponent(defaultfilter)}`
    const {data, error, isLoading} = useSWR(rootUrl, fetcher)

    const handleItemSelection = (_event: React.SyntheticEvent | null, itemId: string, isSelected: boolean)=>{
        if(isSelected){
            props.onDirectoryFetch(itemId)
        }
    }

    // Indexing feedback for the ROOT directory listing
    React.useEffect(()=>{
        props.onLoading(isLoading || (data !== undefined && data.pending))
    }, [isLoading, data])

    const rootDirs = data !== undefined && !data.pending
        ? data.values
            .filter((item: any) => item.type === 'drc')
            .sort((a: any, b: any) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
        : []

    return (
        <div>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore/>}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        {props.src.source_os === 'linux'
                            ? <Tooltip title="Linux source"><FaLinux size={24}/></Tooltip>
                            : <Tooltip title="Windows source"><FaWindows size={24}/></Tooltip>}
                        <Typography variant="subtitle2" sx={{fontWeight:500}}>{props.src.source_name}</Typography>
                        {(isLoading || data?.pending) && <CircularProgress size={14}/>}
                        {error && <Tooltip title="Failed to load root directories"><Warning fontSize="small" color="error"/></Tooltip>}
                    </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{py:1}}>
                    {data?.pending && (
                        <Stack direction="row" spacing={1} alignItems="center" sx={{p:1}}>
                            <CircularProgress size={14}/>
                            <Typography variant="caption" color="text.secondary">
                                File system indexing in progress — the tree will populate automatically.
                            </Typography>
                        </Stack>
                    )}
                    {error && !data && (
                        <Typography variant="caption" color="error" sx={{p:1, display:'block'}}>
                            Failed to load the root of this source.
                        </Typography>
                    )}
                    <SimpleTreeView
                        slots={{collapseIcon:FolderOpen, expandIcon:CreateNewFolder, endIcon:Folder}}
                        sx={{marginTop:1.5}}
                        onItemSelectionToggle={handleItemSelection}>
                        {
                            rootDirs.map((dir: any)=>(
                                <CustomeTreeViews
                                    item={{name:dir.name, path:dir.path, type:'drc'}}
                                    src={props.src}
                                    onLoading={props.onLoading}
                                    onDirectoryContent={props.onDirectoryContent}
                                    onDirectoryFetch={props.onDirectoryFetch}
                                    setDirectorySrc={props.setDirectorySrc}
                                    key={'custom-tree-'+dir.id}
                                />
                            ))
                        }
                    </SimpleTreeView>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
