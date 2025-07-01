'use client'
import * as React from 'react';
import { DataGrid, GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import { useSessionStorageState,useNotifications, PageContainer} from '@toolpad/core';
import API from "../components/api/axios"
import { Delete } from '@mui/icons-material';
import CustomToolBar from '../components/case/customtoolbarcase'
import { Card, CardHeader, Grid } from '@mui/material';
import { FaLinux, FaWindows } from 'react-icons/fa';

export default function CasPage() {
  const [listCas,setListCas] = useSessionStorageState('listeCas','[]')
  const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
  const [listSources,setListSources] = useSessionStorageState('listsources','')

  const notifications = useNotifications()

  const case_colummn: any = [
    {field:'case_name',headerName:'Nom',flex: 1},
    {field:'actions',type:'actions',getActions:(params: any)=>[
      <GridActionsCellItem
        icon={<Delete/>}
        label='Delete'
        onClick={deleteCas(params.id)}
        key={'delete-cas'}
      />
    ]}
  ]

  const onSelectCas=(event: any)=>{
    setCurrentCas(JSON.stringify(event.row))
    currentCas !== event.id ? API.get('/api/cases/'+event.id+'/sources').then(res=>{setListSources(JSON.stringify(res.data))}):null
    notifications.show(currentCas !== null ? 'CASE '+event.row.case_name+' selected':'',{autoHideDuration:3000,severity:'info'})
  }

  const deleteCas = React.useCallback(
    (id:GridRowId)=> () =>{
      API.delete('/api/cases/'+id+'/').then(
        res=>{
          API.get('/api/cases/').then(
            res=>{
              setListCas(JSON.stringify(res.data))
            }
          )
        }
      )
    },[]
  )

  return (    
      <div style={{flex:0,border:0}} className='cases'>
        <PageContainer slots={{header:CustomToolBar}}>
           <DataGrid 
              columns={case_colummn} 
              rows={JSON.parse(listCas || '[]')} 
              getRowId={(row: any)=> row.id_case} 
              onRowClick={onSelectCas} 
              showToolbar
            /> 
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{marginTop:2}}>
              {
                JSON.parse(listSources || '[]').map((src:any)=>{
                  return(
                    <Grid size={2}>
                      <Card>
                        <CardHeader
                          avatar={src.source_os === 'linux' ? <FaLinux size={30}/>: <FaWindows size={30}/>}
                          title={src.source_name} 
                          subheader={src.source_version}
                        />
                      </Card>
                    </Grid>
                  )
                })
              }
            </Grid>
        </PageContainer>
         
      </div>
  );
}
