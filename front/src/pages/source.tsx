"use client"
import * as React from 'react';
import { useDialogs, useSessionStorageState, useNotifications, PageContainer } from '@toolpad/core';
import { DataGrid,GridActionsCellItem, GridRowId, GridRowParams } from '@mui/x-data-grid';
import API from "../components/api/axios"
import {Delete } from '@mui/icons-material';
import CustomToolBarSource from '../components/source/customtoolbarsource';
import SourcePlugins from '../components/source/sourcePlugins';

export default function Sources() {
  const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
  const [currentSrc,setCurrentSrc] = useSessionStorageState('current_source','')
  const [listSources,setListSources] = useSessionStorageState('listsources','[]')
  const [openDialog,setOpenDialog] = React.useState(false)
  const dialog = useDialogs()
  const notification = useNotifications()

  const source_colummn: any = [
    {field:'source_name',headerName:'Nom',flex: 1},
    {field:'source_os',headerName:'OS',flex: 1},
    {field:'source_version',headerName:'Distribution',flex: 1},
    {field:'source_type',headerName:'Type',flex: 1},
    {field:'actions',type:'actions',getActions:(params:GridRowParams)=>[
      <GridActionsCellItem
        icon={<Delete/>}
        label='Delete'
        onClick={onDeleteSource(params.id)}
        key={'delete-src'}
      />,
      <SourcePlugins source={params}/>,
    ]}
  ]

  const onDeleteSource = React.useCallback(
    (id:GridRowId)=> ()=>{
      API.delete('/api/sources/'+id+'/').then(
        res=>{
          notification.show('Deleted the source ',{autoHideDuration:3000,severity:'success'})
          API.get('/api/cases/'+JSON.parse(currentCas || "{id_case:''}").id_case+'/sources').then(res=>{
            setListSources(JSON.stringify(res.data))
          }
          )
        }
      )
    },[currentCas,notification,setListSources]
  )

  const onSelectSrc=(event: any)=>{
    setCurrentSrc(event.id)
  }
  
    return (
    <div  style={{flex:0,border:0}} className='Source'>
      <PageContainer slots={{header:CustomToolBarSource}}>
          <DataGrid columns={source_colummn} rows={JSON.parse(listSources || '[]') || []} 
            getRowId={(row: any)=> row.id_source} 
            showToolbar
            onRowClick={onSelectSrc}
          />
      </PageContainer>
    </div>
  );
}
