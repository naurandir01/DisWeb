// frontend/src/pages/ioc.tsx
'use client'
import * as React from 'react';
import { useSessionStorageState, useNotifications, useDialogs, PageContainer } from '@toolpad/core';
import { Alert, Box, Chip, Stack, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Delete, ManageSearch } from '@mui/icons-material';
import API from '../components/api/axios'
import useIsAdmin from '../components/api/useIsAdmin';

export default function IOC() {
  const [currentCas, setCurrentCas] = useSessionStorageState('cas', '')
  const [iocs, setIOCs] = React.useState<any[]>([])
  const [listIocType, setListIocType] = useSessionStorageState('listioctype', '[]')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const notification = useNotifications()
  const dialogs = useDialogs()
  const [isAdmin] = useIsAdmin()

  const caseId = React.useMemo(() => {
    try { return JSON.parse(currentCas || '{}').id_case ?? '' } catch { return '' }
  }, [currentCas])

  const loadIOCs = React.useCallback(async () => {
    if (!caseId) { setIOCs([]); return }
    setIsLoading(true)
    setError(null)
    try {
      const res = await API.get('/cases/' + caseId + '/iocs')
      setIOCs(res.data)
    } catch {
      setError('Failed to load the IOCs of this case.')
    } finally {
      setIsLoading(false)
    }
  }, [caseId])

  React.useEffect(() => {
    loadIOCs()
  }, [loadIOCs])

  // FIX: IOC deletion is now confirmed first (forensic hygiene: no silent
  // destruction of case data) and all error paths surface a notification.
  // The backend restricts deletion to admins (IsAdminRole) since the RBAC
  // sprint: a 403 is now visibly explained instead of silently ignored
  // (the old .then() had no catch at all).
  const onDeleteIoc = React.useCallback(
    (id: GridRowId) => async () => {
      const confirmed = await dialogs.confirm(
        'Delete this IOC? This action is traced in the audit trail and cannot be undone.',
        { title: 'Delete IOC', severity: 'warning', okText: 'Delete', cancelText: 'Cancel' }
      )
      if (!confirmed) return
      try {
        await API.delete('/iocs/' + id)
        notification.show('IOC deleted', { autoHideDuration: 3000, severity: 'success' })
        loadIOCs()
      } catch (e: any) {
        if (e?.response?.status === 403) {
          notification.show('Only administrators can delete IOCs', { autoHideDuration: 4000, severity: 'warning' })
        } else {
          notification.show('Failed to delete the IOC', { autoHideDuration: 3000, severity: 'error' })
        }
      }
    },
    [loadIOCs, notification, dialogs]
  )

  const iocTypeMap = React.useMemo(() => {
    try {
      const types = JSON.parse(listIocType || '[]') as any[]
      return Object.fromEntries(types.map(t => [t.id_ioctype ?? t.id, t.ioctype_value ?? t.name]))
    } catch { return {} }
  }, [listIocType])

  const ioc_column: GridColDef[] = [
    {
      field: 'ioc_type', headerName: 'Type', width: 140,
      renderCell: (params: any) => {
        const label = params.row.ioc_type__ioctype_value
          ?? iocTypeMap[params.row.ioc_type]
          ?? params.row.ioc_type
        return <Chip size="small" variant="outlined" label={String(label ?? '-')}/>
      },
    },
    {
      field: 'ioc_value', headerName: 'Value', flex: 1,
      renderCell: (params: any) => (
        <Typography variant="body2" fontFamily="monospace" noWrap>
          {params.row.ioc_value}
        </Typography>
      ),
    },
    {
      field: 'ioc_source', headerName: 'Extraction source', flex: 1,
      valueGetter: (_v, row: any) => row.ioc_src ?? row.ioc_source ?? '-',
    },
    {
      field: 'actions', type: 'actions', getActions: (params: any) => [
        ...(isAdmin
          ? [<GridActionsCellItem
              icon={<Delete/>}
              label='Delete'
              onClick={onDeleteIoc(params.id)}
              key={'delete-ioc'}
            />]
          : []),
        // PENDING component: pivot toward enrichment (VirusTotal/OpenCTI)
        <GridActionsCellItem
          icon={<ManageSearch/>}
          label='Investigate'
          onClick={() => notification.show(
            'IOC investigation (VirusTotal/OpenCTI lookup) is coming soon',
            { autoHideDuration: 3000, severity: 'info' })}
          key={'investigate-ioc'}
        />,
      ],
    },
  ]

  if (!caseId) {
    return (
      <PageContainer>
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Select a case first — IOCs are attached to a case.
          </Typography>
        </Box>
      </PageContainer>
    )
  }

  return (
    <div style={{ flex: 0, border: 0 }} className='ioc'>
      <PageContainer>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6">IOCs</Typography>
          <Chip size="small" variant="outlined" color="primary" label={`${iocs.length} indicators`} />
        </Stack>
        {error && <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError(null)}>{error}</Alert>}
        {!isAdmin && (
          <Alert severity="info" sx={{ mb: 1 }}>
            Deletion is restricted to administrators. You can browse and investigate the IOCs.
          </Alert>
        )}
        <div style={{ height: 'calc(100vh - 260px)', minHeight: 400 }}>
          <DataGrid
            columns={ioc_column}
            rows={iocs}
            getRowId={(row: any) => row.id_ioc}
            loading={isLoading}
            showToolbar
            slotProps={{ toolbar: { showQuickFilter: true } }}
            localeText={{ noRowsLabel: 'No IOC recorded on this case yet' }}
            initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          />
        </div>
      </PageContainer>
    </div>
  )
}
