// frontend/src/components/case/customtoolbarcase.tsx
'use client'
import * as React from 'react';
import { Button } from '@mui/material';
import { PageHeaderToolbar, useDialogs, useNotifications, useSessionStorageState } from '@toolpad/core';
import { caseAPI } from '../api/api';
import useIsAdmin from '../api/useIsAdmin';

export default function CustomToolBar(){
    const dialog = useDialogs()
    const notifications = useNotifications()
    const [listCas, setListCas] = useSessionStorageState('listeCas', '[]')
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isAdmin] = useIsAdmin()

    const onClick = async () => {
        const case_name = await dialog.prompt('Name of the CASE', {
            title: 'New Case', okText: 'Create', cancelText: 'Cancel'
        });
        if (!case_name || isSubmitting) return;

        setIsSubmitting(true)
        try {
            const bodyformData = new FormData()
            bodyformData.append('case_name', case_name)
            bodyformData.append('case_description', '')
            // FIX: the CSRF header was unnecessary (session-cookie auth is
            // not used — JWT bearer auth only) and its value was echoed
            // into the error notification (leaking a cookie value to the
            // screen). Removed.
            await caseAPI.addCase(bodyformData, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
            const res = await caseAPI.getCases()
            setListCas(JSON.stringify(res.data))
            notifications.show('New case "' + case_name + '" created',
                {autoHideDuration: 3000, severity: 'success'})
        } catch (e: any) {
            if (e?.response?.status === 403) {
                notifications.show('Only administrators can create cases',
                    {autoHideDuration: 4000, severity: 'warning'})
            } else {
                notifications.show('Failed to create the case "' + case_name + '"',
                    {autoHideDuration: 3000, severity: 'error'})
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <PageHeaderToolbar>
            {/* RBAC parity: backend refuses case creation to non-admins,
                hide the button rather than letting it 403 */}
            {isAdmin && (
                <Button variant='outlined' onClick={onClick} disabled={isSubmitting}>
                    {isSubmitting ? 'Creating…' : 'ADD NEW CASE'}
                </Button>
            )}
        </PageHeaderToolbar>
    )
}
