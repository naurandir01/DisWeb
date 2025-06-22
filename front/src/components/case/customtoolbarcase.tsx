
import { Button } from '@mui/material';
import React from 'react';
import { PageHeaderToolbar, useDialogs,useNotifications,useSessionStorageState } from '@toolpad/core';
import API from '../api/axios'
import Cookies from 'js-cookie'


export default function CustomToolBar(){
    const dialog = useDialogs()
    const notifications = useNotifications()
    const crftOKEN = Cookies.get('csrftoken')
    const [listCas,setListCas] = useSessionStorageState('listeCas','[]')
    
    return(
      <PageHeaderToolbar>
        <Button variant='outlined' onClick={async () =>{
            const case_name = await dialog.prompt('Name of the CASE',{title:'New Case',okText:'CREATE',cancelText:'STOP'});
            if(case_name){
                const crftOKEN = Cookies.get('csrftoken')
                try {
                    const bodyformData = new FormData()
                    bodyformData.append('case_name',case_name)
                    bodyformData.append('case_description','')
                    const res = await API.post('/api/cases/',bodyformData,{
                        headers:{
                            'X-CSRFToken':crftOKEN,
                            'Content-Type':'multipart/form-data'}
                      }).then(res => API.get('/api/cases/').then(res => setListCas(JSON.stringify(res.data))))
                    notifications.show('ADDING NEW CASE '+case_name,{autoHideDuration:3000,severity:'success'})
                } catch (error){
                    notifications.show('ERROR IN CREATING NEW CASE '+case_name +' token: '+crftOKEN,{autoHideDuration:3000,severity:'error'})
                }
            }
        }}>
            ADD NEW CASE
        </Button>
      </PageHeaderToolbar>
    )
  }
  