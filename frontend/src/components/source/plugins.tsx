// frontend/src/components/source/plugins.tsx
'use client'
import * as React from 'react';
import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, Typography } from '@mui/material';
import { DialogProps } from '@toolpad/core/useDialogs';
import Plugin from './plugin';
import { useSessionStorageState, useNotifications } from '@toolpad/core';
import { artefactAPI } from '../api/api';

const plugins_not_to_show_list = [
    'mft.timeline','yara','mft','activity','os','ips','hostname','version','architecture','mft.records',
    'example_yield','example_none','example_record','example','loaders','plugins',
    'timezone','language','ntversion','domain','keys','pathenvironment','qfind','_dpapi_keyprovider_keychain.keys',
    '_dpapi_keyprovider_lsa_defaultpassword.keys','_dpapi_keyprovider_credhist.keys','_dpapi_keyprovider_empty.keys','regf','walkfs'
]

// FIX: JSON.parse(sessionStorage) crashed the dialog if the stored value
// was corrupt — parsed once, defensively, instead of 3 times inline.
function useSourceFromSession(idSource: string){
    const [listSources] = useSessionStorageState('listsources', '[]')
    return React.useMemo(() => {
        try {
            return (JSON.parse(listSources || '[]') as any[])
                .find((src: any) => src.id_source === idSource) ?? null
        } catch {
            return null
        }
    }, [listSources, idSource])
}

export default function Plugins({payload, open, onClose}: DialogProps<any>){
    const source = useSourceFromSession(payload?.src?.row?.id_source)
    const notification = useNotifications()

    // Track statuses reported by each Plugin child → live RUN ALL feedback
    const [statuses, setStatuses] = React.useState<Record<string, string>>({})
    const [runningAll, setRunningAll] = React.useState(false)

    const visiblePlugins: any[] = React.useMemo(() => {
        if (!source || !Array.isArray(source.source_plugins)) return []
        return source.source_plugins
            .filter((plugin: any) => !plugins_not_to_show_list.includes(plugin.name))
            // FIX: 'sensivity' typo → 'sensitivity'
            .sort((a: any, b: any) => a.name.localeCompare(b.name, undefined, {sensitivity: 'base'}))
    }, [source])

    const handleStatusChange = React.useCallback((pluginName: string, status: string) => {
        setStatuses(prev => ({...prev, [pluginName]: status}))
    }, [])

    const counts = React.useMemo(() => {
        const c = {done: 0, failed: 0, pending: 0, todo: 0}
        visiblePlugins.forEach(p => {
            const s = statuses[p.name] ?? 'NOT FOUND'
            if (s === 'SUCCESS') c.done++
            else if (s === 'FAILED') c.failed++
            else if (s === 'PENDING') c.pending++
            else c.todo++
        })
        return c
    }, [visiblePlugins, statuses])

    // FIX: RUN ALL previously fired every request without awaiting anything
    // and showed a blind notification. Now: sequential-ish with Promise.allSettled,
    // per-plugin error counting, honest summary, guard against double-click.
    const onClickAllRun = async () => {
        if (runningAll) return
        const toRun = visiblePlugins.filter(p => (statuses[p.name] ?? 'NOT FOUND') === 'NOT FOUND')
        if (toRun.length === 0) {
            notification.show('All plugins have already been run', {autoHideDuration: 3000, severity: 'info'})
            return
        }
        setRunningAll(true)
        try {
            const results = await Promise.allSettled(
                toRun.map(p => artefactAPI.runSourceArtefactPlugin(source.id_source, p.name))
            )
            const ok = results.filter(r => r.status === 'fulfilled').length
            const ko = results.length - ok
            results.forEach((r, i) => {
                if (r.status === 'fulfilled') handleStatusChange(toRun[i].name, 'PENDING')
            })
            if (ko === 0) {
                notification.show(`${ok} plugins launched`, {autoHideDuration: 3000, severity: 'success'})
            } else {
                notification.show(`${ok} plugins launched, ${ko} failed`, {autoHideDuration: 5000, severity: 'warning'})
            }
        } finally {
            setRunningAll(false)
        }
    }

  return(
    <Dialog fullWidth open={open} onClose={() => onClose()} maxWidth='xl'>
      <DialogTitle>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="h6">Plugins — {source?.source_name ?? 'unknown source'}</Typography>
            <Chip size="small" color="success" variant="outlined" label={`${counts.done} done`}/>
            <Chip size="small" color="warning" variant="outlined" label={`${counts.pending} running`}/>
            <Chip size="small" color="error" variant="outlined" label={`${counts.failed} failed`}/>
            <Chip size="small" variant="outlined" label={`${counts.todo} not run`}/>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {!source
            ? <Alert severity="warning">Source not found in the current session. Re-open the sources page.</Alert>
            : <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                {
                    visiblePlugins.map((plugin: any) => (
                        // FIX: missing key prop (React reconciliation warning +
                        // unstable identity on re-render)
                        <Grid size={4} key={plugin.name}>
                            <Plugin source={source} plugin={plugin}
                                    onStatusChange={(s: string) => handleStatusChange(plugin.name, s)}/>
                        </Grid>
                    ))
                }
              </Grid>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickAllRun} disabled={runningAll || !source}>
            {runningAll ? 'Launching…' : 'RUN ALL'}
        </Button>
        <Button onClick={() => onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
