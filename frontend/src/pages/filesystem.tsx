// frontend/src/pages/filesystem.tsx
'use client'
import * as React from 'react';
import { PageContainer, useSessionStorageState } from '@toolpad/core';
import { Box, Grid, Typography } from '@mui/material';
import Arboresence from '../components/filesystem/arborescense';
import DirectoryContent from '../components/filesystem/directorycontent';
import FileContent from '../components/filesystem/filecontent';
import API from '../components/api/axios'

export default function FileSystem() {
  const [listSources, setListSources] = useSessionStorageState('listsources', '[]')
  const [directoryContent, setDirectoryContent] = React.useState<any[]>([])
  const [directoryLoading, setDirectoryLoading] = React.useState<any>(false)
  const [currentFile, setCurrentFile] = React.useState<any>({path: '', metadata: {}});
  const [id_source, setDirectorySrc] = React.useState('')

  const sources: any[] = listSources ? JSON.parse(listSources) : [];

  const handleLoading = (loading: any) => {
    setDirectoryLoading(loading)
  }

  // FIX: unified single handler — the page previously exposed two props
  // (setDirectoryContent AND onDirectoryContent) that wrote the same state,
  // plus console.log noise on every directory update.
  const handleDirectoryFetch = (url: string) => {
    setDirectoryLoading(true)
    API.get(url).then(res => {
      setDirectoryContent(res.data.values ?? [])
    }).catch(() => {
      setDirectoryContent([])
    }).finally(() => {
      setDirectoryLoading(false)
    })
  }

  const handleSetFile = (file: any) => {
    setCurrentFile(file)
  }

  const handleSetDirectorySrc = (src: any) => {
    setDirectorySrc(src)
  }

  return (
    <div style={{flex: 0, border: 0}} className='FileSystem'>
      <PageContainer>
        <Grid container spacing={1}>
          <Grid size={2}>
            {/* FIX: overflowY 'scroll' → 'auto' (permanent scrollbar gone) */}
            <Box sx={{overflowY: 'auto', maxHeight: 'calc(100vh - 160px)', pr: 0.5}}>
              <Grid container spacing={1}>
                {
                  sources.map((src: any) => (
                    <Grid size={12} key={'grid-arboresence-' + src.source_name}>
                      <Arboresence src={src}
                          setDirectoryContent={setDirectoryContent}
                          onLoading={handleLoading}
                          onDirectoryFetch={handleDirectoryFetch}
                          setDirectorySrc={handleSetDirectorySrc}
                          key={'arboresence-' + src.source_name}
                      />
                    </Grid>
                  ))
                }
                {
                  sources.length === 0 && (
                    <Grid size={12}>
                      <Typography variant="body2" color="text.secondary" sx={{p: 2}}>
                        No source available. Add a source to a case first.
                      </Typography>
                    </Grid>
                  )
                }
              </Grid>
            </Box>
          </Grid>
          <Grid size={10}>
            <DirectoryContent rows={directoryContent} loading={directoryLoading} onSetFile={handleSetFile} id_source={id_source}/>
            <FileContent currentFile={currentFile} id_source={id_source}/>
          </Grid>
        </Grid>
      </PageContainer>
    </div>
  );
}
