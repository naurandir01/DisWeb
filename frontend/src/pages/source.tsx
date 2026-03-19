"use client"
import * as React from 'react';
import { useDialogs, useSessionStorageState, useNotifications, PageContainer } from '@toolpad/core';
import { DataGrid,GridActionsCellItem, GridRowId, GridRowParams } from '@mui/x-data-grid';
import {Delete } from '@mui/icons-material';
import CustomToolBarSource from '../components/source/customtoolbarsource';
import SourceCustomPlugins from '../components/source/sourceCustomPlugins';
import SourcePlugins from '../components/source/sourcePlugins';
import { sourceAPI,caseAPI } from '../components/api/api';

export default function Sources() {
  const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
  const [currentSrc,setCurrentSrc] = React.useState({source_plugins:[]})
  const [listSources,setListSources] = useSessionStorageState('listsources','[]')
  const notification = useNotifications()

  const source_colummn: any = [
    {field:'source_name',headerName:'Nom',flex: 1},
    {field:'source_os',headerName:'OS',flex: 1},
    {field:'source_version',headerName:'Distribution',flex: 1},
    {field:'source_type',headerName:'Type',flex: 1},
    {field:'actions',type:'actions',width:250,getActions:(params:GridRowParams)=>[
      <GridActionsCellItem
        icon={<Delete/>}
        label='Delete'
        onClick={onDeleteSource(params.id)}
        key={'delete-src'}
      />,
      <SourceCustomPlugins source={params}/>,
      <SourcePlugins source={params}/>
    ]}
  ]

  const onDeleteSource = React.useCallback(
    (id:GridRowId)=> ()=>{
      sourceAPI.deleteSource(id).then(
        res=>{
          notification.show('Deleted the source ',{autoHideDuration:3000,severity:'success'})
          caseAPI.getCaseSources(JSON.parse(currentCas || "{id_case:''}").id_case).then(res=>{
            setListSources(JSON.stringify(res.data))
          }
          )
        }
      )
    },[currentCas,notification,setListSources]
  )

  const onSelectSrc=(event: any)=>{
    setCurrentSrc(JSON.parse(listSources || '[]').find((src: any) => src.id_source === event.id) || {})
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
