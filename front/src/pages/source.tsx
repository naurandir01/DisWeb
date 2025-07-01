"use client"
import * as React from 'react';
import { useDialogs, useSessionStorageState, useNotifications, PageContainer } from '@toolpad/core';
import { DataGrid,GridActionsCellItem, GridRowId, GridRowParams } from '@mui/x-data-grid';
import API from "../components/api/axios"
import {Delete } from '@mui/icons-material';
import CustomToolBarSource from '../components/source/customtoolbarsource';
import SourceCustomPlugins from '../components/source/sourceCustomPlugins';
import SourcePlugins from '../components/source/sourcePlugins';

const plugins_not_to_show_list = [
    'mft_timeline','yara','mft','activity','os','ips','hostname','version','architecture',
    'example_yield','example_none','example_record','example','loaders','plugins','walkfs',
    'timezone','language','ntversion','domain','keys','pathenvironment','qfind',"_dpapi_keyprovider_keychain.keys",
    "_dpapi_keyprovider_lsa_defaultpassword.keys","_dpapi_keyprovider_credhist.keys","_dpapi_keyprovider_empty.keys",'regf'
]

export default function Sources() {
  const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
  const [currentSrc,setCurrentSrc] = React.useState({source_plugins:[]})
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
      <SourceCustomPlugins source={params}/>,
      <SourcePlugins source={params}/>
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
