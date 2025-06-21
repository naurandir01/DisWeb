"use client"
import * as React from 'react';
import { useSessionStorageState, useNotifications, PageContainer } from '@toolpad/core';
import { DataGrid, GridActionsCellItem, GridRowId} from '@mui/x-data-grid';
import { Delete } from '@mui/icons-material';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import API from '../components/api/axios'


export default function IOC() {
  const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
  const [iocs,setIOCs] = React.useState([])
  const [listIocType,setListIocType] = useSessionStorageState('listioctype','[]')
  const notification = useNotifications()

  const ioc_column: any = [
    {field:'ioc_type__ioctype_value',headerName:'Type',flex: 1,},
    {field:'ioc_value',headerName:'Valeur',flex: 1},
    {field:'actions',type:'actions',getActions:(params: any)=>[
        <GridActionsCellItem
          icon={<Delete/>}
          label='Supprimer'
          onClick={onDeleteIoc(params.id)}
          key={'delete-iod'}
        />,
        <GridActionsCellItem
          icon={<ManageSearchIcon/>}
          label='Recherche'
          key={'rechercher-ioc'}
        />
      ]}
  ]

  const onDeleteIoc = React.useCallback(
    (id:GridRowId)=>()=>{
      API.delete('/api/iocs/'+id).then(
        res => {
          notification.show("Supprésion de l'ioc",{autoHideDuration:3000,severity:'success'})
          API.get('/api/cases/'+JSON.parse(currentCas|| '{}').id_case+'/iocs').then(res=>{setIOCs(res.data)})
        }
      )
    },[currentCas,notification]
  )

  React.useEffect(()=>{
    const fetchData = async () =>{
      try {
          const res = await API.get('/api/cases/'+JSON.parse(currentCas|| '{}').id_case+'/iocs')
          setIOCs(res.data)
      } catch (error){
        console.error("Erreur dans la récuperation des iocs:",error)
      }
    };fetchData()
  },[currentCas])

  

  return (
    <div style={{flex:0,border:0}} className='ioc'>
      <PageContainer>
        <DataGrid 
          columns={ioc_column} 
          rows={iocs} 
          getRowId={(row: any)=>row.id_ioc} 
          showToolbar
        />
      </PageContainer>
      
    </div>
      
  );
}
