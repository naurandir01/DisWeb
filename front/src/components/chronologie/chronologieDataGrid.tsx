"use client"
import * as React from 'react';
import { useSessionStorageState } from '@toolpad/core';
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridRowModel, GridSortModel} from '@mui/x-data-grid';
import API from '../api/axios'
import { Box, Typography } from '@mui/material';

export default function ChronologieDataGrid(props: any){
    const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
    const [listSources,setListSources] = useSessionStorageState('listsources','[]')

    const [rows,setRows] = React.useState<GridRowModel[]>([])
    const [rowsCount,setRowsCount] = React.useState(-1)
   
    const [isLoading,setIsLoading] = React.useState(false)

    const [paginationModel,setPaginationModel] = React.useState<GridPaginationModel>({page:0,pageSize:100})
    const [filterModel,setfilterModel] = React.useState<GridFilterModel>({items:[]})
    const [sortModel,setSortModel] = React.useState<GridSortModel>([])

    
    const chronologie_coulumn: GridColDef[] = [
        {field:'timeline_src_id',headerName:'Source',flex:1,
            renderCell:(params:any)=>{return <Typography>{JSON.parse(listSources || '[]').find((item: any)=>item.id_source === params.value).source_name}</Typography>}},
        {field:'timeline_ts',headerName:'Timestamp',flex:1,type:'dateTime',valueGetter:(value: string)=>new Date(value)},
        {field:'timeline_type',headerName:'Type',flex:1},
        {field:'timeline_value',headerName:'Value',flex:1},
        
    ]

    function loadServerRows(page: number,size: number,filter: any,sort:any): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(
                () => {
                    API.get('/api/cases/'+JSON.parse(currentCas||'{}').id_case+'/timeline/'+(page*size)+'/'+(page+1)*size,{params:{filtermodel:filter,sortingmodel:sort,timerange:props.currentTimeStampGlobal}}).then(res=>{
                    setRows(res.data)
                    setIsLoading(false)
                });
                },
            ); 
        });
      }
    
    React.useEffect(() => {
    let active = true;
    (
        async () => {
        setIsLoading(true)
        const newsrows = await loadServerRows(paginationModel.page,paginationModel.pageSize,filterModel.items,sortModel);
        if (!active) {
            return;
        }
        setIsLoading(false)
        }
        
    )();
    },[paginationModel.page,paginationModel.pageSize,filterModel.items,sortModel])

    function getRowsLength(filter:any): Promise<any>{
        return new Promise((resolve) => {
            setTimeout(
                () => {
                    API.get('/api/cases/'+JSON.parse(currentCas||'{}').id_case+'/timeline/size',{params:{filtermodel:filter,timerange:props.currentTimeStampGlobal}}).then(res=>{
                    setRowsCount(res.data.size)
                });
                },
            ); 
        })
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
    },[filterModel.items,props.currentTimeStampGlobal])

    React.useEffect(() => {
        let active = true;
        (
            async () => {
                const newsrows = await loadServerRows(paginationModel.page,paginationModel.pageSize,filterModel.items,sortModel);
                if (!active) {
                    return;
                }
            }
        )()
    },[props.currentTimeStampGlobal])

    return(
        <Box sx={{height:1000}}>
            <DataGrid
                columns={chronologie_coulumn}
                rows={rows}
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
        </Box>
    )
}