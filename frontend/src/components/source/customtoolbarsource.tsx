// frontend/src/components/source/customtoolbarsource.tsx
'use client'
import * as React from 'react';
import {
    Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogProps, DialogTitle, FormControlLabel, MenuItem, Switch, TextField,
} from '@mui/material';
import { useDialogs, useSessionStorageState, useNotifications, PageHeaderToolbar } from '@toolpad/core';
import { sourceAPI, caseAPI } from '../api/api';

function CasDialog({open, onClose = () => {}}: DialogProps){
    const [listSourceNotLink, setListSourceNotLink] = React.useState<any[]>([])
    const [currentCas] = useSessionStorageState('cas', '')
    const [sourceToLink, setSourceToLink] = React.useState('')
    const [isencrypted, setIsEncrypted] = React.useState(false)
    const [key_type, setKeyType] = React.useState('PASSPHRASE')
    const [key_value, setKeyValue] = React.useState('')
    const [listSources, setListSources] = useSessionStorageState('listsources', '')
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const notification = useNotifications()

    const caseId = React.useMemo(() => {
        try { return JSON.parse(currentCas || '{}').id_case ?? '' } catch { return '' }
    }, [currentCas])

    React.useEffect(() => {
        if (!caseId) return
        const fechData = async () => {
            try {
                const res = await caseAPI.getCaseSourceNotLink(caseId)
                setListSourceNotLink(res.data)
            } catch (error){
                console.error('Error when getting unlinked sources:', error)
            }
        };
        fechData();
    }, [caseId, open])

    // Validation before submission: encrypted sources need a non-empty key
    const canSubmit = sourceToLink !== ''
        && (!isencrypted || key_value.trim() !== '')
        && !isSubmitting

    const Creation = async () => {
        if (!canSubmit) return
        setIsSubmitting(true)
        setError(null)
        try {
            const bodyformData = new FormData()
            bodyformData.append('src_case', currentCas || '')
            bodyformData.append('src_path', sourceToLink)
            bodyformData.append('crypt_key_type', isencrypted ? key_type : '')
            bodyformData.append('crypt_key_value', isencrypted ? key_value : '')
            await sourceAPI.addSource(bodyformData)
            const res = await caseAPI.getCaseSources(caseId)
            setListSources(JSON.stringify(res.data))
            notification.show('Source "' + sourceToLink + '" added and being analyzed — the SHA-256 baseline is computed at ingestion.',
                {autoHideDuration: 5000, severity: 'success'})
            onClose({}, 'backdropClick')
        } catch (e: any) {
            // Ingestion can legitimately fail (wrong decrypt key, unreadable
            // image…) — surfaced in the dialog instead of a generic toast
            setError(e?.response?.data?.detail
                ?? 'Failed to add the source. Check the path and the decryption key.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog fullWidth open={open} onClose={() => onClose({}, 'backdropClick')}>
            <DialogTitle> ADD NEW SOURCE</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Evidence images available on the server but not yet linked to this case.
                </DialogContentText>
                {/* FIX: select had no `value` — the UI state desynced from
                    what was actually selected (submitting an empty path) */}
                <TextField id="listSourceNonLier" select fullWidth
                    helperText="Select the evidence image to ingest"
                    value={sourceToLink}
                    onChange={(event: any) => setSourceToLink(event.target.value)}
                >
                    {listSourceNotLink.length === 0 && (
                        <MenuItem disabled value="">No unlinked image found on the server</MenuItem>
                    )}
                    {listSourceNotLink.map((src: any) => (
                        <MenuItem key={src} value={src}>{src}</MenuItem>
                    ))}
                </TextField>
                <FormControlLabel
                    control={<Switch checked={isencrypted} onChange={(e) => setIsEncrypted(e.target.checked)} />}
                    label="Encrypted source? (LUKS and BitLocker are supported)"
                    sx={{mt: 1}}
                />
                {isencrypted &&
                    <Box sx={{display: 'grid', gap: 1.5, mt: 1}}>
                        <TextField id="key_type" select fullWidth
                            label="Key type"
                            value={key_type}
                            onChange={(event: any) => setKeyType(event.target.value)}
                        >
                            <MenuItem value='PASSPHRASE'>Passphrase</MenuItem>
                            <MenuItem value='RECOVERY_KEY'>Recovery key</MenuItem>
                        </TextField>
                        <TextField id="crypt_key" fullWidth
                            type="password"
                            label="Decryption key"
                            helperText="The key is stored encrypted and traced in the audit trail"
                            value={key_value}
                            onChange={(event: any) => setKeyValue(event.target.value)}
                        />
                    </Box>
                }
                {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={Creation} disabled={!canSubmit}>
                    {isSubmitting ? 'Adding…' : 'Add source'}
                </Button>
                <Button onClick={() => onClose({}, 'backdropClick')} disabled={isSubmitting}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}

export default function CustomToolBarSource(){
    const dialogs = useDialogs()
    return (
        <PageHeaderToolbar>
            <Button variant='outlined' onClick={async () => {
                await dialogs.open(CasDialog)
            }}>
                ADD NEW SOURCE
            </Button>
        </PageHeaderToolbar>
    )
}
