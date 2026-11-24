// frontend/src/pages/source.tsx
'use client'
import * as React from 'react';
import { Alert, Stack, Typography } from '@mui/material';
import { useSessionStorageState, useNotifications, useDialogs, PageContainer } from '@toolpad/core';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Delete, FolderCopy } from '@mui/icons-material';
import CustomToolBarSource from '../components/source/customtoolbarsource';
import SourceCustomPlugins from '../components/source/sourceCustomPlugins';
import SourcePlugins from '../components/source/sourcePlugins';
import { sourceAPI, caseAPI } from '../components/api/api';
import useIsAdmin from '../components/api/useIsAdmin';

export default function Sources() {
  const [currentCas] = useSessionStorageState('cas', '')
  const [listSources, setListSources] = useSessionStorageState('listsources', '[]')
  const [isLoading, setIsLoading] = React.useState(false)
  const notification = useNotifications()
  const dialogs = useDialogs()
  const [isAdmin] = useIsAdmin()

  const caseId = React.useMemo(() => {
    try { return JSON.parse(currentCas || '{}').id_case ?? '' } catch { return '' }
  }, [currentCas])

  const sources: any[] = React.useMemo(() => {
    try { return JSON.parse(listSources || '[]') } catch { return [] }
  }, [listSources])

  const loadSources = React.useCallback(async () => {
    if (!caseId) return
    setIsLoading(true)
    try {
      const res = await caseAPI.getCaseSources(caseId)
      setListSources(JSON.stringify(res.data))
    } catch {
      notification.show('Failed to load the sources', {autoHideDuration: 3000, severity: 'error'})
    } finally {
      setIsLoading(false)
    }
  }, [caseId, setListSources, notification])

  React.useEffect(() => { loadSources() }, [loadSources])

  // FIX: no confirmation before deleting EVIDENCE, and no .catch() — the
  // 403 (non-admin) or any server error vanished silently while the UI
  // kept behaving as if everything went fine.
  const onDeleteSource = React.useCallback(
    (id: GridRowId) => async () => {
      const confirmed = await dialogs.confirm(
        'Delete this source? Its indexed artefacts, registry data and tasks ' +
        'are permanently removed from the platform. ' +
        'The evidence image file on disk is NOT touched. ' +
        'This action is traced in the audit trail.',
        { title: 'Delete source', severity: 'warning', okText: 'Delete source', cancelText: 'Cancel' }
      )
      if (!confirmed) return
      try {
        await sourceAPI.deleteSource(id)
        notification.show('Source deleted', {autoHideDuration: 3000, severity: 'success'})
        loadSources()
      } catch (e: any) {
        if (e?.response?.status === 403) {
          notification.show('Only administrators can delete sources', {autoHideDuration: 4000, severity: 'warning'})
        } else {
          notification.show('Failed to delete the source', {autoHideDuration: 3000, severity: 'error'})
        }
      }
    },
    [dialogs, notification, loadSources]
  )

  const source_colummn: GridColDef[] = [
    {
      field: 'source_name', headerName: 'Name', flex: 1,
      renderCell: (params: any) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <FolderCopy fontSize="small" sx={{color: 'text.secondary', flexShrink: 0}}/>
          <Typography variant="body2" noWrap>{params.row.source_name}</Typography>
        </Stack>
      ),
    },
    {
      field: 'source_os', headerName: 'OS', width: 110,
      renderCell: (params: any) => (
        <Typography variant="caption">{String(params.row.source_os ?? '-').toUpperCase()}</Typography>
      ),
    },
    { field: 'source_version', headerName: 'Distribution', flex: 1,
      valueGetter: (_v, row: any) => row.source_version ?? '-' },
    {
      field: 'source_type', headerName: 'Type', width: 90,
      renderCell: (params: any) => String(params.row.source_type ?? '-').toUpperCase(),
    },
    {
      // Integrity status chip (sprint 3 backend fields)
      field: 'source_hash_verified_at', headerName: 'Integrity', width: 130,
      renderCell: (params: any) => {
        if (!params.row.source_hash_sha256) return <Typography variant="caption" color="text.secondary">No baseline</Typography>
        if (!params.row.source_hash_verified_at) return <Typography variant="caption" color="text.secondary">Pending</Typography>
        return <Typography variant="caption" color="success.main">Verified</Typography>
      },
    },
    {
      field: 'actions', type: 'actions', width: 250,
      getActions: (params: any) => [
        ...(isAdmin ? [
          <GridActionsCellItem
            icon={<Delete/>}
            label='Delete'
            onClick={onDeleteSource(params.id)}
            key={'delete-src'}
          />,
        ] : []),
        <SourceCustomPlugins source={params} key={'custom-plugins'}/>,
        <SourcePlugins source={params} key={'plugins'}/>,
      ],
    },
  ]

  if (!caseId) {
    return (
      <PageContainer slots={{header: CustomToolBarSource}}>
        <Stack sx={{py: 8}} alignItems="center">
          <Typography color="text.secondary">
            Select a case first — sources belong to a case.
          </Typography>
        </Stack>
      </PageContainer>
    )
  }

  return (
    <div style={{flex: 0, border: 0}} className='Source'>
      <PageContainer slots={{header: CustomToolBarSource}}>
        {!isAdmin && (
          <Alert severity="info" sx={{mb: 1}}>
            Source deletion is administrator-only. You can browse, analyze and run plugins on all sources.
          </Alert>
        )}
        <div style={{height: 'calc(100vh - 240px)', minHeight: 400}}>
          <DataGrid columns={source_colummn} rows={sources}
            getRowId={(row: any) => row.id_source}
            loading={isLoading}
            showToolbar
            slotProps={{ toolbar: { showQuickFilter: true } }}
            localeText={{ noRowsLabel: 'No source on this case yet — add one above' }}
            initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          />
        </div>
      </PageContainer>
    </div>
  );
}
