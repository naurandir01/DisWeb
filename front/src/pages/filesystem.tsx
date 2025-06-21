'use client'
import * as React from 'react';
import { PageContainer, useSessionStorageState } from '@toolpad/core';
import { Box, Grid, Typography } from '@mui/material';
import Arboresence from '../components/filesystem/arborescense';
import DirectoryContent from '../components/filesystem/directorycontent';
import FileContent from '../components/filesystem/filecontent';

export default function SystemDeFichier() {
  const [listSources,setListSources] = useSessionStorageState('listsources','[]')
  const [directoryContent,setDirectoryContent] = React.useState([])
  const [directoryLoading,setDirectoryLoading] = React.useState([])
  const [currentFile,setCurrentFile] = React.useState({path:'',metadata:{}});
  const [id_source,setDirectorySrc] = React.useState('')

  const handleLoading=(loading: any)=>{
    setDirectoryLoading(loading)
  }

  const handleDirectoryContent=(content: any)=>{
    setDirectoryContent(content)
  }

  const handleSetFile=(file: any)=>{
    setCurrentFile(file)
  }

  const handleSetDirectorySrc=(src: any)=>{
    setDirectorySrc(src)
  }


  return (
    <div  style={{flex:0,border:0,}} className='SystemDeFichier'>
      <PageContainer>
         <Grid container spacing={1}>
            <Grid size={2} >
                <Box sx={{overflowY:'scroll',maxHeight:1150}}>
                  <Grid container spacing={1}>
                    {
                      listSources !== null ? JSON.parse(listSources).map((src: any)=>{
                        return(
                          <Grid size={12} key={'grid-arboresence-'+src.source_name}>
                            <Arboresence src={src} 
                                setDirectoryContent={setDirectoryContent} 
                                onLoading={handleLoading} 
                                onDirectoryContent={handleDirectoryContent}
                                setDirectorySrc={handleSetDirectorySrc}
                                key={'arboresence-'+src.source_name}
                            />
                          </Grid>
                          )
                        }):null
                      }
                     </Grid>
                </Box>
            </Grid>
            <Grid size={10}> 
                <DirectoryContent rows={directoryContent} loading={directoryLoading} onSetFile={handleSetFile} id_source={id_source}/>
                <FileContent currentFile={currentFile}  id_source={id_source}/>
            </Grid>
        </Grid>      
      </PageContainer>
         
    </div>
      
  );
}
