'use client'
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useSessionStorageState,useNotifications } from '@toolpad/core';
import API from "../components/api/axios"

export default function DashboardPage() {
  const [listCas,setListCas] = useSessionStorageState('listeCas','[]')
  const [listIocType,setListIocType] = useSessionStorageState('listioctype','[]')
  const [listYaraRules, setListYaraRules] = useSessionStorageState('listyararules','[]')

  React.useEffect(()=>{
    const fechData = async () =>{
      try {
        const res = await  API.get('/api/cases/')
        setListCas(JSON.stringify(res.data))
      } catch (error){
        console.error("Error when getting the list of case", error)
      }
    };
    fechData();
  },[])
  
  React.useEffect(()=>{
      const fechData = async () =>{
        try {
          const res = await  API.get('/api/iocs_types/')
          setListIocType(JSON.stringify(res.data))
        } catch (error){
          console.error("Error whyen getting the list of IOC Type :", error)
        }
      };
      fechData();
  },[])

  React.useEffect(()=>{
    const fechData = async () =>{
      try {
        const res = await  API.get('/api/yara/')
        setListYaraRules(JSON.stringify(res.data))
      } catch (error){
        console.error("Error when getting the list of yara rule:", error)
      }
    };
    fechData();
},[])

  return <Typography></Typography>;
}
