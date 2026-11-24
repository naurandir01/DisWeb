// frontend/src/components/yara/yarabutton.tsx
'use client'
import * as React from 'react'
import {
    Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography,
} from '@mui/material';
import { DialogProps, useDialogs, useSessionStorageState, useNotifications } from '@toolpad/core';
import { yaraAPI } from '../api/api';

function RunYaraRules({payload, open, onClose}: DialogProps<any>){
    const [listYaraRules] = useSessionStorageState('listyararules', '[]')
    const [listYaraRulesToRun, setListYaraRulesToRun] = React.useState<string[]>([])
    const [isRunning, setIsRunning] = React.useState(false)
    const notification = useNotifications()

    const yaraRules: any[] = React.useMemo(() => {
        try { return JSON.parse(listYaraRules || '[]') } catch { return [] }
    }, [listYaraRules])

    const handleYaraRuleCheck = (value: string) => () => {
        const currentIndex = listYaraRulesToRun.indexOf(value);
        const newChecked = [...listYaraRulesToRun];
        if (currentIndex === -1) newChecked.push(value);
        else newChecked.splice(currentIndex, 1);
        setListYaraRulesToRun(newChecked);
    }

    // FIX: the old try/catch around .then() caught nothing (network errors
    // happen asynchronously) — awaited + allSettled with honest counting.
    // The dialog now closes after launching (it stayed stuck open before).
    const executeYara = async () => {
        if (listYaraRulesToRun.length === 0) return
        setIsRunning(true)
        try {
            const results = await Promise.allSettled(
                listYaraRulesToRun.map(ruleId =>
                    yaraAPI.runYaraRuleOnSource(payload.src.id_source, ruleId))
            )
            const ok = results.filter(r => r.status === 'fulfilled').length
            const ko = results.length - ok
            if (ko === 0) {
                notification.show(ok + ' YARA scan(s) launched', {autoHideDuration: 3000, severity: 'success'})
            } else {
                notification.show(ok + ' launched, ' + ko + ' failed',
                    {autoHideDuration: 5000, severity: 'warning'})
            }
            onClose()
        } finally {
            setIsRunning(false)
        }
    }

    const selectedNames = yaraRules
        .filter(r => listYaraRulesToRun.includes(r.id_yararule))
        .map(r => r.yararule_name)

    return (
        <Dialog fullWidth open={open} onClose={() => onClose()}>
            <DialogTitle>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h6">YARA Rules to Run</Typography>
                    <Chip count={listYaraRulesToRun.length}/>
                </Stack>
            </DialogTitle>
            <DialogContent>
                {yaraRules.length === 0 && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                        No YARA rule available. Add rules in Parameters → Yara Rules first.
                    </Alert>
                )}
                <List>
                    {yaraRules.map((rule: any) => (
                        <ListItem key={rule.id_yararule} disablePadding>
                            <ListItemButton role={undefined}
                                            onClick={handleYaraRuleCheck(rule.id_yararule)} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={listYaraRulesToRun.includes(rule.id_yararule)}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={rule.yararule_name}
                                    secondary={rule.yararule_description || undefined}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                {/* FIX: 'Start'/'Stop' were misleading — 'Stop' merely closed
                    the dialog. Renamed + confirm-less guard on empty selection. */}
                <Button onClick={executeYara}
                        disabled={listYaraRulesToRun.length === 0 || isRunning}>
                    {isRunning ? 'Launching…' : 'Start scans'}
                </Button>
                <Button onClick={() => onClose()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}

// Tiny inline chip (avoids importing MUI Chip in two places)
function Chip({count}: {count: number}){
    return (
        <Typography variant="caption" sx={{
            px: 1, borderRadius: 10, border: '1px solid rgba(0,0,0,0.23)',
            color: 'text.secondary'
        }}>
            {count} selected
        </Typography>
    )
}

export default function YaraButton(props: any){
    const dialog = useDialogs()

    return (
        <Button onClick={async () => {
            await dialog.open(RunYaraRules, {src: props.source, data: props.data})
        }}>
            Yara Rules To Execute
        </Button>
    )
}
