"use client"
import * as React from 'react';
import { useSessionStorageState } from '@toolpad/core';
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridRowModel, GridSortModel} from '@mui/x-data-grid';
import API from '../api/axios'
import { Box, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';

function  ConvertOperator(filterModel: GridFilterModel){
    switch(filterModel.items[0].operator){
        case 'contains':
            return filterModel.items[0].field + ' CONTAINS '+filterModel.items[0].value ;
        case 'doesNotContain':
            return filterModel.items[0].field + ' NOT CONTAINS '+filterModel.items[0].value ;
        case 'equals':
            return filterModel.items[0].field + ' = ' +filterModel.items[0].value ;
        case 'doesNotEqual':
            return filterModel.items[0].field + ' != ' +filterModel.items[0].value ;
        case 'startsWith':
            return filterModel.items[0].field + ' STARTS WITH '+filterModel.items[0].value;
        case 'isNotEmpty':
            return filterModel.items[0].field + '  IS NOT EMPTY';
        case 'isEmpty':
            return filterModel.items[0].field + ' IS EMPTY';
        case 'isAnyOf':
            return filterModel.items[0].field + ' IN ['+ filterModel.items[0].value+']'; ;
        case 'is':
            return filterModel.items[0].field + ' = ' +filterModel.items[0].value ;
        case 'not':
            return filterModel.items[0].field + ' != ' +filterModel.items[0].value ; 
        case 'after':
            return filterModel.items[0].field + ' > ' +filterModel.items[0].value ;
        case 'before':
            return filterModel.items[0].field + ' < ' +filterModel.items[0].value ;
        case 'onOrAfter':
            return filterModel.items[0].field + ' >= ' +filterModel.items[0].value ;
        case 'onOrBefore':
            return filterModel.items[0].field + ' <= ' +filterModel.items[0].value ;
    }
}

export default function ChronologieDataGrid(props: any){
    const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
    const [listSources,setListSources] = useSessionStorageState('listsources','[]')

    const [rows,setRows] = React.useState<GridRowModel[]>([])
    const [rowsCount,setRowsCount] = React.useState(-1)
   
    const [isLoading,setIsLoading] = React.useState(false)

    const [paginationModel,setPaginationModel] = React.useState<GridPaginationModel>({page:0,pageSize:100})
    const [filterModel,setfilterModel] = React.useState<GridFilterModel>({items:[]})
    const [sortModel,setSortModel] = React.useState<GridSortModel>([])

    const defaultfilter = "case = '"+JSON.parse(currentCas||"{'id_case':'0'}").id_case+"' AND ts EXISTS"
    
    const columns: GridColDef[] = [
        {field:'source',headerName:'Source',flex:1,
            renderCell:(params:any)=>{return <Typography>{JSON.parse(listSources || '[]').find((item: any)=>item.id_source === params.value).source_name}</Typography>}},
        {field:'ts',headerName:'Timestamp',flex:1,type:'dateTime',valueGetter:(value: string)=>new Date(value)},
        {field:'plugin',headerName:'Type',flex:1},
    ]

    const [event,setEvent] = React.useState<any>({})

    React.useEffect(()=>{
            let active = true;
            console.log("Filter Model",filterModel);
            (
                async ()=>{
                    const newsrows = await loadArtefacts(paginationModel,filterModel,sortModel);
                    if (!active) {
                        return;
                    }
                }
            )();
    },[paginationModel,filterModel,sortModel])


    function loadArtefacts(pagination: GridPaginationModel,filter: GridFilterModel,sort:GridSortModel): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(
                ()=>{
                    API.get('/api/cases/'+JSON.parse(currentCas||"{'id_case':'0'}").id_case+'/timelinemeilisearch/',{
                        params:{
                            filter:filter.items.length == 0 ? defaultfilter : defaultfilter +' AND ' + ConvertOperator(filter),
                            q: filter.quickFilterValues !== undefined ? filter.quickFilterValues[0]:'',
                            offset:pagination.page*pagination.pageSize,
                            limit:pagination.pageSize,
                            sort:sort.length > 0 ? sort[0].field + ':' + sort[0].sort : ''
                            
                        }
                    }).then(res=>{
                        setRows(res.data.hits);
                        setRowsCount(res.data.total);
                        
                    })
                },
            );
        })
    }

    const notToDisplay = [
        'id',
        'source',
        'case',
        'generated',
        'classification'
    ]

   
    return(
        <Box sx={{height:1000}}>
            <Grid container spacing={2}>
                <Grid size={4}>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        //loading={isLoading}
                        showToolbar
                        pagination
                        rowCount={rowsCount}
                        slotProps={{ toolbar: { showQuickFilter: false } }}

                        onRowClick={(params:any)=>{setEvent(params.row)}}

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
                </Grid>
                <Grid size={8}>
                    <Card>
                        <CardHeader title="Event Details"/>
                        <CardContent>
                            {
                                Object.keys(event).filter((key)=>key !== 'id' && key !== 'domain' && key !== 'source' && key !== 'case')
                                .map((key:any)=>{
                                    return(
                                        <Typography>{key}: {event[key]}</Typography>
                                    )
                                })
                            }
                        </CardContent>

                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}