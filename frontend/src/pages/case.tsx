// frontend/src/pages/case.tsx
'use client'
import * as React from 'react';
import { Alert, Box, Card, CardHeader, Chip, Grid, Stack, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Delete, Settings } from '@mui/icons-material';
import { useSessionStorageState, useNotifications, useDialogs, PageContainer } from '@toolpad/core';
import CustomToolBar from '../components/case/customtoolbarcase'
import MeiliSettingsDialog from '../components/case/meilisettings';
import { FaLinux, FaWindows } from 'react-icons/fa';
import { caseAPI } from '../components/api/api';
import useIsAdmin from '../components/api/useIsAdmin';

export default function CasPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [meiliDialogId, setMeiliDialogId] = React.useState<GridRowId | null>(null)
  const [listCas, setListCas] = useSessionStorageState('listeCas', '[]')
  const [currentCas, setCurrentCas] = useSessionStorageState('cas', '')
  const [listSources, setListSources] = useSessionStorageState('listsources', '')
  const notifications = useNotifications()
  const dialogs = useDialogs()
  const [isAdmin] = useIsAdmin()

  const cases: any[] = React.useMemo(() => {
    try { return JSON.parse(listCas || '[]') } catch { return [] }
  }, [listCas])

  const sources: any[] = React.useMemo(() => {
    try { return JSON.parse(listSources || '[]') } catch { return [] }
  }, [listSources])

  const currentCaseObj: any = React.useMemo(() => {
    try { return JSON.parse(currentCas || 'null') } catch { return null }
  }, [currentCas])

  const loadCases = React.useCallback(async () => {
    setIsLoading(true); setError(null)
    try {
      const res = await caseAPI.getCases()
      setListCas(JSON.stringify(res.data))
    } catch { setError('Failed to load cases.') }
    finally { setIsLoading(false) }
  }, [setListCas])

  React.useEffect(() => { loadCases() }, [loadCases])

  const case_colummn: GridColDef[] = [
    {
      field: 'case_name', headerName: 'Name', flex: 1,
      renderCell: (params: any) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" sx={{fontWeight: currentCaseObj?.id_case === params.row.id_case ? 700 : 400}}>
            {params.row.case_name}
          </Typography>
          {currentCaseObj?.id_case === params.row.id_case &&
            <Chip size="small" color="primary" label="Selected"/>}
        </Stack>
      ),
    },
    { field: 'case_description', headerName: 'Description', flex: 1,
      valueGetter: (_v, row: any) => row.case_description ?? '-' },
    {
      field: 'actions', type: 'actions', getActions: (params: any) => [
        // RBAC: backend refuses POST/DELETE on cases for non-admins —
        // hide the destructive action instead of letting it fail silently
        ...(isAdmin ? [
          <GridActionsCellItem
            icon={<Delete/>} label='Delete'
            onClick={deleteCas(params.id)} key={'delete-cas'}/>,
          <GridActionsCellItem
            icon={<Settings/>} label='Meili Settings'
            onClick={getMeiliIndexSettings(params.id)} key={'meili-settings-cas'}/>,
        ] : []),
      ],
    },
  ]

  const onSelectCas = (event: any) => {
    setCurrentCas(JSON.stringify(event.row))
    // Always reload sources (the stale-comparison
    // `currentCas !== event.id` mixed a stringified object with an id)
    caseAPI.getCaseSources(event.id).then(res => {
      setListSources(JSON.stringify(res.data))
    }).catch(() => {
      notifications.show('Failed to load the sources of this case', {autoHideDuration: 3000, severity: 'error'})
    })
    notifications.show('Case "' + event.row.case_name + '" selected', {autoHideDuration: 3000, severity: 'info'})
  }

  // FIX: deletion now confirmed (a case cascades to its evidence!) and
  // errors surfaced — the old .then() chain had no catch at all, so a
  // 403 (non-admin) or a 409 (case still has sources) disappeared silently.
  const deleteCas = React.useCallback(
    (id: GridRowId) => async () => {
      const confirmed = await dialogs.confirm(
        'Delete this case? All linked sources, artefacts and tasks are permanently destroyed. ' +
        'This action is traced in the audit trail and cannot be undone.',
        { title: 'Delete case', severity: 'warning', okText: 'Delete case', cancelText: 'Cancel' }
      )
      if (!confirmed) return
      try {
        await caseAPI.deleteCase(id)
        notifications.show('Case deleted', {autoHideDuration: 3000, severity: 'success'})
        // If the deleted case was selected, clear the session selection
        if (currentCaseObj?.id_case === id) {
          setCurrentCas('')
          setListSources('[]')
        }
        loadCases()
      } catch (e: any) {
        if (e?.response?.status === 403) {
          notifications.show('Only administrators can delete cases', {autoHideDuration: 4000, severity: 'warning'})
        } else if (e?.response?.status === 409) {
          notifications.show('Cannot delete: the case still has linked evidence', {autoHideDuration: 4000, severity: 'error'})
        } else {
          notifications.show('Failed to delete the case', {autoHideDuration: 3000, severity: 'error'})
        }
      }
    },
    [dialogs, notifications, loadCases, currentCaseObj, setCurrentCas, setListSources]
  )

  // FIX: real structured dialog (was console.log, then a raw JSON alert)
  const getMeiliIndexSettings = React.useCallback(
    (id: GridRowId) => async () => {
      setMeiliDialogId(id)
    }, []
  )

  return (
      <div style={{flex:0, border:0}} className='cases'>
        <PageContainer slots={{header: CustomToolBar}}>
          {error && <Alert severity="error" sx={{mb: 1}} onClose={() => setError(null)}>{error}</Alert>}
          {!isAdmin && (
            <Alert severity="info" sx={{mb: 1}}>
              You can browse cases and select one for analysis. Case creation and deletion are administrator-only.
            </Alert>
          )}
          <div style={{height: 'calc(100vh - 320px)', minHeight: 300}}>
            <DataGrid
              columns={case_colummn}
              rows={cases}
              getRowId={(row: any) => row.id_case}
              onRowClick={onSelectCas}
              loading={isLoading}
              showToolbar
              slotProps={{ toolbar: { showQuickFilter: true } }}
              localeText={{ noRowsLabel: 'No case yet — create one to start an investigation' }}
              initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
            />
          </div>
          {sources.length > 0 && (
            <Stack sx={{mt: 2}} spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                Sources of the selected case
              </Typography>
              <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 2}}>
                {sources.map((src: any) => (
                  // FIX: missing key prop on the cards
                  <Grid size={3} key={src.id_source ?? src.source_name}>
                    <Card variant="outlined">
                      <CardHeader
                        avatar={src.source_os === 'linux'
                            ? <FaLinux size={24} title="Linux"/>
                            : <FaWindows size={24} title="Windows"/>}
                        title={<Typography variant="body2">{src.source_name}</Typography>}
                        subheader={
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            {src.source_type && <Chip size="small" variant="outlined" label={String(src.source_type).toUpperCase()}/>}
                            {src.source_version && <Typography variant="caption" color="text.secondary">{src.source_version}</Typography>}
                          </Stack>
                        }
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          )}
          {cases.length === 0 && !isLoading && !error && (
            <Box sx={{py: 4, textAlign: 'center'}}>
              <Typography color="text.secondary">
                Create your first case with the button above.
              </Typography>
            </Box>
          )}
          <MeiliSettingsDialog
            payload={{id: meiliDialogId}}
            open={meiliDialogId !== null}
            onClose={() => setMeiliDialogId(null)}
          />
        </PageContainer>
      </div>
  );
}
