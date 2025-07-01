'use client'
import * as React from 'react';
import API from '../api/axios'
import { Box, Card, CardContent, CardHeader, Dialog, DialogContent, DialogProps, DialogTitle, Grid, IconButton } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { useSessionStorageState, useDialogs } from '@toolpad/core';
import { DataGrid, GridColDef,GridRowModel,GridToolbar} from '@mui/x-data-grid';
import { Search } from '@mui/icons-material';
import RegistrySearch from './registrysearch';

function RegistryTreeView(props: any){
    const [item,setItem] = React.useState(props.item)
    const [childs,setChild] = React.useState<any>([])

    const handleChildren=()=>{
        props.onSelectedPath(item.reg_path)
    }

    function getChild(item: any): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(
                () => {
                    API.get('/api/sources/'+props.src.id_source+'/registry/parent/?path='+item.reg_path).then(res=>{
                    setChild(res.data)
                });
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
            itemId={'/api/sources/'+props.src.id_source+'/registry/parent/?path='+item.reg_path}
            label={childs !== undefined ?  item.reg_path.split('\\')[item.reg_path.split('\\').length -1] +'('+childs.length+')':item.reg_path.split('\\')[item.reg_path.split('\\').length -1] }
            onClick={handleChildren}
            key={item.reg_path}
            id={item.id}
        >
            {
                childs !== undefined ? childs
                    .sort((a: any,b:any)=>a.reg_path.localeCompare(b.reg_path,undefined,{sensivity:'base'}))
                    .map((child: any,index: any)=>{
                    return(
                            <RegistryTreeView 
                                item={child} 
                                src={props.src} 
                                onLoading={props.onLoading} 
                                onRegistryContent={props.onRegistryContent}
                                onSelectedPath={props.onSelectedPath}
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
        {field:'reg_ts',headerName:'Timestamp',flex:1, filterable: false},
        {field:'reg_path',headerName:'Path',flex:1, filterable: false},
        {field:'reg_key',headerName:'Key',flex:1, filterable: false},
        {field:'reg_value',headerName:'Value',flex:1},
    ]


    const handelItemSelection =(event: React.SyntheticEvent | null,itemId: string,isSelected:boolean)=>{
        API.get(itemId).then(res=>{
            setRows(res.data)
            setLoading(false)
        })
    }

    return(
        <Box sx={{width:2000,height:820}}>
            <Card>
                <CardHeader action={<IconButton onClick={()=>dialog.open(searchRegistry)}><Search/></IconButton>}/>
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid size={2}>
                            <Box sx={{overflowY:'scroll',maxHeight:1000}}>
                                <SimpleTreeView sx={{marginTop:1.5}} onItemSelectionToggle={handelItemSelection}>
                                    <RegistryTreeView
                                        item={{reg_path:'HKEY_LOCAL_MACHINE',reg_key:'HKEY_LOCAL_MACHINE',id:'teazddad',reg_value:'zeafezf'}}
                                        src={source}
                                        
                                    />
                                    <RegistryTreeView
                                        item={{reg_path:'HKEY_USERS',reg_key:'HKEY_USERS',id:'teazddzqdadzaad',reg_value:'zefzef'}}
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