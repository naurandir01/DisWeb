// frontend/src/components/source/plugin.tsx
'use client'
import { Button, Tooltip } from '@mui/material';
import * as React from 'react';
import { CheckCircle, Error, NotStarted } from '@mui/icons-material';
import { useNotifications } from '@toolpad/core';
import { artefactAPI, taskAPI } from '../api/api';

type TaskStatus = 'NOT FOUND' | 'PENDING' | 'SUCCESS' | 'FAILED';

// Small helper: poll the task status until it reaches a terminal state
// (SUCCESS/FAILED). One single polling loop instead of the two competing
// effects (a one-shot fetch + a detached 10s interval) that duplicated
// requests and raced each other with stale state.
function usePluginStatus(sourceId: string, pluginName: string,
                         onStatusChange?: (s: TaskStatus) => void) {
    const [status, setStatus] = React.useState<TaskStatus>('NOT FOUND')
    const statusRef = React.useRef(status)
    statusRef.current = status

    React.useEffect(() => {
        let cancelled = false

        const fetchStatus = async () => {
            try {
                const res = await taskAPI.getSourceTask(sourceId, pluginName)
                if (cancelled) return
                const next: TaskStatus = res.data.task_status ?? 'NOT FOUND'
                setStatus(next)
                onStatusChange?.(next)
                return next
            } catch (e) {
                console.error('Error fetching task ' + pluginName, e)
                return undefined
            }
        }

        const tick = async () => {
            const next = await fetchStatus()
            // Stop polling on terminal states; keep going otherwise.
            // Read via ref to avoid the stale-closure bug of the old
            // setInterval closure (it never saw state updates).
            if (!cancelled && next !== undefined && next !== 'SUCCESS' && next !== 'FAILED') {
                timer = setTimeout(tick, 5000)
            }
        }
        let timer = setTimeout(tick, 500)

        return () => { cancelled = true; clearTimeout(timer) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceId, pluginName])

    return [status, setStatus] as const
}

export default function Plugin(props: any){
    const source = props.source
    const plugin = props.plugin
    const notification = useNotifications()
    const [isLaunching, setIsLaunching] = React.useState(false)

    const [pluginStatus, setPluginStatus] = usePluginStatus(
        source.id_source, plugin.name, props.onStatusChange
    )

    const onClickNotRun = async () => {
        // Guard: no double-launch while a request is in flight or the task
        // is already queued (previously a second click spawned duplicates)
        if (pluginStatus === 'PENDING' || isLaunching) return
        if (pluginStatus === 'SUCCESS') return   // already done — nothing to run

        setIsLaunching(true)
        try {
            await artefactAPI.runSourceArtefactPlugin(source.id_source, plugin.name)
            notification.show('Plugin ' + plugin.name + ' launched', {autoHideDuration: 3000, severity: 'info'})
            setPluginStatus('PENDING')
            props.onStatusChange?.('PENDING')
        } catch {
            notification.show('Failed to launch plugin ' + plugin.name, {autoHideDuration: 3000, severity: 'error'})
        } finally {
            setIsLaunching(false)
        }
    }

  return (
      
            <Button
                endIcon={
                    pluginStatus === 'NOT FOUND' ?
                        <NotStarted fontSize="large" color="primary" />
                    : pluginStatus === 'SUCCESS' ?
                        <CheckCircle fontSize="large" color="success" />
                    : pluginStatus === 'FAILED' ?
                        <Error fontSize="large" color="error"/>
                    : null
                }
                loading={pluginStatus === 'PENDING' || isLaunching}
                loadingPosition='end'
                onClick={onClickNotRun}
                // FAILED stays clickable to retry; NOT FOUND launches; SUCCESS inert
                disabled={pluginStatus === 'SUCCESS'}
                color={pluginStatus === 'PENDING' ? 'primary'
                    : pluginStatus === 'SUCCESS' ? 'success'
                    : pluginStatus === 'FAILED' ? 'error'
                    : 'inherit'}
            >
                {plugin.name}
            </Button>
        </Tooltip>
    )
}
