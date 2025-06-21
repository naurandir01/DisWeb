'use client'
import * as React from 'react';
import API from '../api/axios'
import { Box, Grid } from '@mui/material';
import { useSessionStorageState, useNotifications } from '@toolpad/core';
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridRowModel, GridSortModel, GridToolbar} from '@mui/x-data-grid';

export default function RegistrySearch(props: any){
    const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
    const [source,setSource] = React.useState(props.source)

    const [rows,setRows] = React.useState<GridRowModel[]>([])
    const [rowsCount,setRowsCount] = React.useState(-1)
       
    const [isLoading,setIsLoading] = React.useState(false)
    
    const [paginationModel,setPaginationModel] = React.useState<GridPaginationModel>({page:0,pageSize:100})
    const [filterModel,setfilterModel] = React.useState<GridFilterModel>({items:[]})
    const [sortModel,setSortModel] = React.useState<GridSortModel>([])

    const registry_coulumn: GridColDef[] = [
        {field:'reg_ts',headerName:'Temps',flex:1 },
        {field:'reg_path',headerName:'Chemin',flex:1 },
        {field:'reg_key',headerName:'Clé',flex:1 },
        {field:'reg_value',headerName:'Valeur',flex:1},
    ]

    function loadSourceRegistry(page: number,size: number,filter: any,sort:any): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(
                () => {
                    API.get('/api/sources/'+source.id_source+'/registry/'+(page*size)+'/'+(page+1)*size,{params:{filtermodel:filter,sortingmodel:sort}}).then(res=>{
                    setRows(res.data)
                    setIsLoading(false)
                });
                },
            ); 
        })
    }

    React.useEffect(() => {
        let active = true;
        (
            async () => {
            setIsLoading(true)
            const newsrows = await loadSourceRegistry(paginationModel.page,paginationModel.pageSize,filterModel.items,sortModel);
            if (!active) {
                return;
            }
            setIsLoading(false)
            }
            
        )();
    },[paginationModel.page,paginationModel.pageSize,filterModel.items,sortModel])

    function getRowsLength(filter: any): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(
                () => {
                    API.get('/api/sources/'+source.id_source+'/registry/size',{params:{filtermodel:filter}}).then(res=>{
                    setRowsCount(res.data.count)
                });
                }
            )
        });
    }

    React.useEffect(() => {
        let active = true;
        (
            async () => {
                const rowslength = await getRowsLength(filterModel.items);
                if (!active) {
                    return;
                }
            }
        )()
    },[filterModel.items])


    return(

            <DataGrid
                rows={rows}
                columns={registry_coulumn}
                loading={isLoading}
                showToolbar
                pagination
                

                pageSizeOptions={[100]}
                rowCount={rowsCount}

                paginationMode='server'
                onPaginationModelChange={setPaginationModel}
                paginationModel={paginationModel}
                
                filterMode='server'
                onFilterModelChange={setfilterModel}
                filterModel={filterModel}

                sortingMode='server'
                onSortModelChange={setSortModel}
                sortModel={sortModel}
            />

    )
}