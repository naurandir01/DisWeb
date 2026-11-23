'use client'
import * as React from 'react';
import API from '../api/axios'
import { Box, Card, CardContent, CardHeader, Dialog, DialogContent, DialogProps, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { useSessionStorageState, useDialogs } from '@toolpad/core';
import { DataGrid, GridColDef,GridRowModel} from '@mui/x-data-grid';
import { Search } from '@mui/icons-material';
import RegistrySearch from './registrysearch';
import { sourceAPI,artefactAPI } from '../api/api';

function RegistryTreeView(props: any){
    const [item,setItem] = React.useState(props.item)
    const [childs,setChild] = React.useState<any>([])


    function getChild(item: any): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(
                () => {
                    artefactAPI.getSourceRegistryKeys(props.src.id_source,{params:{path:item.path}}).then(res=>{
                    setChild(res.data)
                })
                }
            )
        });
    }

    React.useEffect(() => {
        let active = true;
        (
            async () => {
                const rowslength = await getChild(item);
                if (!active) {
                    return;
                }
            }
        )()
    },[item])

    return(
        <TreeItem
            itemId={item.path}
            label={item.name}
           
            key={item.path}
            id={item.id}
        >
            {
                childs !== undefined ? childs
                    .sort((a: any,b:any)=>a.path.localeCompare(b.name,undefined,{sensivity:'base'}))
                    .map((child: any,index: any)=>{
                    return(
                            <RegistryTreeView 
                                item={child} 
                                src={props.src} 
                                onLoading={props.onLoading} 
                                onRegistryContent={props.onRegistryContent}
                                
                            />
                    )
                }):null
            }
        </TreeItem>
    )
}




export default function Registry(props: any){
    const [source,setSource] = React.useState(props.source)
    const dialog = useDialogs()

    function RegistrySearchDialog({open,onClose= () => {}}:DialogProps){
        return(
            <Dialog fullWidth={true} open={open} onClose={()=>onClose({},'backdropClick')}maxWidth={'xl'}>
                <DialogTitle> Search in registry</DialogTitle>
                <DialogContent>
                    <RegistrySearch source={props.source}/>
                </DialogContent>
            </Dialog>
        )
    }

    const searchRegistry = RegistrySearchDialog

    const [rows,setRows] = React.useState<GridRowModel[]>([])

    const [loading,setLoading] = React.useState(false)
    
    const registry_coulumn: GridColDef[] = [
        {field:'name',headerName:'Name',flex:1},
        {field:'value',headerName:'Value',flex:1},
        {field:'type',headerName:'Type',flex:1},
        {field:'ts',headerName:'Timestamp',flex:1,valueGetter:(value: number)=> value && new Date(value)},
    ]

    const handelItemSelection =(event: React.SyntheticEvent | null,itemId: string,isSelected:boolean)=>{
        artefactAPI.getSourceRegistryValues(source.id_source,{params:{path:itemId}}).then(res=>{
            setRows(res.data)
        })
    }

    return(
        <Box sx={{width:2000,height:820}}>
            <Card>
                <CardHeader action={<IconButton onClick={()=>dialog.open(searchRegistry)}><Search/></IconButton>}/>
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid size={2}>
                            <Box sx={{overflowY:'scroll',maxHeight:1000,overflowX:'scroll'}}>
                                <SimpleTreeView sx={{marginTop:1.5}} onItemSelectionToggle={handelItemSelection}>
                                    <RegistryTreeView
                                        item={{path:'HKEY_LOCAL_MACHINE',name:'HKEY_LOCAL_MACHINE',id:'HKEY_LOCAL_MACHINE'}}
                                        src={source}
                                        
                                    />
                                    <RegistryTreeView
                                        item={{path:'HKEY_USERS',name:'HKEY_USERS',id:'HKEY_USERS'}}
                                        src={source}
                                        
                                    />
                                </SimpleTreeView>
                            </Box>
                        </Grid>
                        <Grid size={10}>
                            <Box sx={{height:1000}}>
                                 <DataGrid
                                    rows={rows}
                                    columns={registry_coulumn}
                                    loading={loading}
                                    showToolbar
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    )
}