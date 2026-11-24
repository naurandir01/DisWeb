// frontend/src/components/source/taskButton.tsx
'use client'
import * as React from 'react';
import { Button, CircularProgress, Stack, Tooltip } from '@mui/material';
import { useNotifications } from '@toolpad/core';
import API from "../api/axios"
import { CheckCircle, Error, NotStarted } from '@mui/icons-material';
import { taskAPI } from '../api/api';

type TaskStatus = 'NOT FOUND' | 'PENDING' | 'SUCCESS' | 'FAILED';

export default function TaskButton(props: any){
    const notification = useNotifications()
    const [taskStatus, setTaskStatus] = React.useState<TaskStatus>('NOT FOUND')
    const [isLaunching, setIsLaunching] = React.useState(false)

    // FIX: single polling loop (like the plugins) — the old code fetched
    // once on mount and never again, so a launched task stayed visually
    // "NOT FOUND" until the dialog was reopened.
    React.useEffect(() => {
        let cancelled = false
        let timer: ReturnType<typeof setTimeout>

        const tick = async () => {
            try {
                const res = await taskAPI.getSourceTask(props.id, props.task.type)
                if (cancelled) return
                const next: TaskStatus = res.data.task_status ?? 'NOT FOUND'
                setTaskStatus(next)
                if (next !== 'SUCCESS' && next !== 'FAILED') {
                    timer = setTimeout(tick, 5000)
                }
            } catch (e) {
                console.error('Error getting the task status ' + props.task.type, e)
            }
        }
        tick()

        return () => { cancelled = true; clearTimeout(timer) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.id, props.task.type])

    const executeTask = async () => {
        if (taskStatus === 'PENDING' || taskStatus === 'SUCCESS' || isLaunching) return
        setIsLaunching(true)
        try {
            // FIX: try/catch around .then() caught nothing — the promise
            // rejection escaped to an unhandled rejection
            await API.get('/sources/' + props.id + '/' + props.task.type)
            notification.show('Task "' + props.task.name + '" launched',
                {autoHideDuration: 3000, severity: 'success'})
            setTaskStatus('PENDING')
        } catch (error) {
            console.error('Error starting the task ' + props.task.type, error)
            notification.show('Failed to start task "' + props.task.name + '"',
                {autoHideDuration: 3000, severity: 'error'})
        } finally {
            setIsLaunching(false)
        }
    }

    return (
        <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
                variant="contained" color="primary"
                onClick={executeTask} key={props.task.type}
                // FIX: FAILED was permanently locked — retry is allowed
                disabled={taskStatus === 'PENDING' || taskStatus === 'SUCCESS' || isLaunching}
                loading={taskStatus === 'PENDING' || isLaunching}
                loadingPosition="start"
            >
                {props.task.name} Plugin
            </Button>
            <Tooltip title={
                taskStatus === 'NOT FOUND' ? 'Not started yet'
                : taskStatus === 'PENDING' ? 'Running…'
                : taskStatus === 'SUCCESS' ? 'Completed'
                : taskStatus === 'FAILED' ? 'Failed — you can retry'
                : ''
            }>
                <span>
                    {taskStatus === 'NOT FOUND' ?
                        <NotStarted fontSize="large" color="primary" />
                    : taskStatus === 'PENDING' ?
                        <CircularProgress size={24}/>
                    : taskStatus === 'SUCCESS' ?
                        <CheckCircle fontSize="large" color="success" />
                    : taskStatus === 'FAILED' ?
                        <Error fontSize="large" color="error"/>
                    : null}
                </span>
            </Tooltip>
        </Stack>
    )
}
