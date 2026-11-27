// frontend/src/components/parametre/usermanagement.tsx
'use client'
import * as React from 'react';
import {
    Alert, Box, Button, Card, Checkbox, Chip, Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, FormControlLabel, IconButton, ListItemText, MenuItem,
    Stack, Tab, Tabs, TextField, Tooltip, Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import {
    Add, Delete, Group as GroupIcon, Key, Person, PersonOff, Shield, VpnKey,
} from '@mui/icons-material';
import { useDialogs, useNotifications, PageContainer } from '@toolpad/core';
import { usersAPI, UserEntry, GroupEntry, default as api } from '../api/api';
import useIsAdmin from '../api/useIsAdmin';

const ROLES = ['ADMIN', 'ANALYST', 'VIEWER'];

const ROLE_COLORS: Record<string, any> = {
    ADMIN: 'error',
    ANALYST: 'primary',
    VIEWER: 'default',
};

// ---------- Create user dialog ----------
function CreateUserDialog({open, onClose, onCreated}: {open: boolean, onClose: () => void, onCreated: () => void}){
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [role, setRole] = React.useState('ANALYST')
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const notification = useNotifications()

    const canSubmit = username.trim() !== '' && password.length >= 8 && !isSubmitting

    const submit = async () => {
        if (!canSubmit) return
        setIsSubmitting(true)
        setError(null)
        try {
            await usersAPI.createUser(username.trim(), password, email.trim(), role)
            notification.show(`User "${username}" created`, {autoHideDuration: 3000, severity: 'success'})
            setUsername(''); setPassword(''); setEmail(''); setRole('ANALYST')
            onCreated()
            onClose()
        } catch (e: any) {
            setError(e?.response?.data?.detail ?? 'Failed to create the user.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog fullWidth open={open} onClose={onClose} maxWidth="sm">
            <DialogTitle>Create a new user</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{mt: 1}}>
                    <TextField label="Username" value={username}
                               onChange={e => setUsername(e.target.value)} autoFocus/>
                    <TextField label="Email (optional)" value={email} type="email"
                               onChange={e => setEmail(e.target.value)}/>
                    <TextField label="Password" value={password} type="password"
                               helperText="Minimum 8 characters"
                               onChange={e => setPassword(e.target.value)}/>
                    <TextField select label="Role" value={role} onChange={e => setRole(e.target.value)}>
                        {ROLES.map(r => (
                            <MenuItem key={r} value={r}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip size="small" color={ROLE_COLORS[r]} variant="outlined" label={r}/>
                                    <Typography variant="caption">
                                        {r === 'ADMIN' ? 'Full administration'
                                         : r === 'ANALYST' ? 'Investigation and analysis'
                                         : 'Read-only access'}
                                    </Typography>
                                </Stack>
                            </MenuItem>
                        ))}
                    </TextField>
                    {error && <Alert severity="error">{error}</Alert>}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={submit} disabled={!canSubmit}>
                    {isSubmitting ? 'Creating…' : 'Create user'}
                </Button>
                <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}

// ---------- Change password dialog ----------
function ChangePasswordDialog({open, onClose, username, onChanged}: any){
    const [password, setPassword] = React.useState('')
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const notification = useNotifications()

    const submit = async () => {
        if (password.length < 8 || isSubmitting) return
        setIsSubmitting(true)
        setError(null)
        try {
            await usersAPI.updateUser(username, {password})
            notification.show(`Password of "${username}" updated`, {autoHideDuration: 3000, severity: 'success'})
            onChanged()
            onClose()
        } catch (e: any) {
            setError(e?.response?.data?.detail ?? 'Failed to update the password.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog fullWidth open={open} onClose={onClose} maxWidth="xs">
            <DialogTitle>Change password — {username}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{mt: 1}}>
                    <TextField label="New password" type="password" autoFocus value={password}
                               helperText="Minimum 8 characters — the user must re-authenticate"
                               onChange={e => setPassword(e.target.value)}/>
                    {error && <Alert severity="error">{error}</Alert>}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={submit} disabled={password.length < 8 || isSubmitting}>Update</Button>
                <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}

// ---------- Main component ----------
export default function UserManagement(){
    const [isAdmin, isAdminLoading] = useIsAdmin()
    const dialogs = useDialogs()
    const notification = useNotifications()

    const [tab, setTab] = React.useState(0)

    const [users, setUsers] = React.useState<UserEntry[]>([])
    const [groups, setGroups] = React.useState<GroupEntry[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const [createOpen, setCreateOpen] = React.useState(false)
    const [pwUser, setPwUser] = React.useState<string | null>(null)
    const [newGroupName, setNewGroupName] = React.useState('')

    // My own username (to forbid self-deactivation/self-deletion in UI)
    const [me, setMe] = React.useState<string>('')

    const load = React.useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const [u, g, m] = await Promise.all([
                usersAPI.getUsers(),
                usersAPI.getGroups(),
                api_get_me(),
            ])
            setUsers(u.data)
            setGroups(g.data)
            setMe(m.data.username)
        } catch (e: any) {
            if (e?.response?.status === 403) {
                setError('Administrator role required to manage users.')
            } else {
                setError('Failed to load users and groups.')
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => { load() }, [load])

    // Small helper: current username
    function api_get_me(){
        return api.get('/users/me/')
    }

    const changeRole = React.useCallback(async (username: string, role: string) => {
        try {
            await usersAPI.updateUser(username, {role})
            notification.show(`Role of "${username}" set to ${role}`,
                {autoHideDuration: 3000, severity: 'success'})
            load()
        } catch (e: any) {
            notification.show(e?.response?.data?.detail ?? 'Failed to change the role',
                {autoHideDuration: 3000, severity: 'error'})
        }
    }, [notification, load])

    const toggleActive = React.useCallback(async (username: string, is_active: boolean) => {
        try {
            await usersAPI.updateUser(username, {is_active})
            notification.show(`"${username}" ${is_active ? 'reactivated' : 'deactivated'}`,
                {autoHideDuration: 3000, severity: is_active ? 'success' : 'warning'})
            load()
        } catch (e: any) {
            notification.show(e?.response?.data?.detail ?? 'Failed to update the account',
                {autoHideDuration: 3000, severity: 'error'})
        }
    }, [notification, load])

    const deleteUser = React.useCallback(async (username: string) => {
        const confirmed = await dialogs.confirm(
            `Delete the user "${username}"? Their audit trail entries are kept.`,
            {title: 'Delete user', severity: 'warning', okText: 'Delete', cancelText: 'Cancel'}
        )
        if (!confirmed) return
        try {
            await usersAPI.deleteUser(username)
            notification.show(`User "${username}" deleted`, {autoHideDuration: 3000, severity: 'success'})
            load()
        } catch (e: any) {
            notification.show(e?.response?.data?.detail ?? 'Failed to delete the user',
                {autoHideDuration: 3000, severity: 'error'})
        }
    }, [dialogs, notification, load])

    const assignGroups = React.useCallback(async (username: string, groups: string[]) => {
        try {
            await usersAPI.updateUser(username, {groups})
            notification.show(`Groups of "${username}" updated`, {autoHideDuration: 2000, severity: 'success'})
            load()
        } catch (e: any) {
            notification.show(e?.response?.data?.detail ?? 'Failed to update groups',
                {autoHideDuration: 3000, severity: 'error'})
        }
    }, [notification, load])

    const createGroup = async () => {
        const name = newGroupName.trim()
        if (!name) return
        try {
            await usersAPI.createGroup(name)
            notification.show(`Group "${name}" created`, {autoHideDuration: 3000, severity: 'success'})
            setNewGroupName('')
            load()
        } catch (e: any) {
            notification.show(e?.response?.data?.detail ?? 'Failed to create the group',
                {autoHideDuration: 3000, severity: 'error'})
        }
    }

    const deleteGroup = async (name: string) => {
        const confirmed = await dialogs.confirm(
            `Delete the group "${name}"? Users keep their individual roles.`,
            {title: 'Delete group', severity: 'warning', okText: 'Delete', cancelText: 'Cancel'}
        )
        if (!confirmed) return
        try {
            await usersAPI.deleteGroup(name)
            notification.show(`Group "${name}" deleted`, {autoHideDuration: 3000, severity: 'success'})
            load()
        } catch (e: any) {
            notification.show(e?.response?.data?.detail ?? 'Failed to delete the group',
                {autoHideDuration: 3000, severity: 'error'})
        }
    }

    const userColumns: GridColDef[] = [
        {
            field: 'username', headerName: 'User', width: 160,
            renderCell: (params: any) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    {params.row.is_superuser ? <Shield fontSize="small" color="warning"/> : <Person fontSize="small"/>}
                    <Typography variant="body2" sx={{fontWeight: params.row.username === me ? 700 : 400}}>
                        {params.row.username}
                    </Typography>
                    {params.row.username === me && <Chip size="small" label="you" variant="outlined"/>}
                </Stack>
            ),
        },
        { field: 'email', headerName: 'Email', flex: 1,
          valueGetter: (_v, row: any) => row.email || '—' },
        {
            field: 'role', headerName: 'Role', width: 170,
            renderCell: (params: any) => (
                <TextField select size="small" value={params.row.role}
                           disabled={params.row.is_superuser || !isAdmin}
                           onChange={e => changeRole(params.row.username, e.target.value)}
                           sx={{minWidth: 130}}>
                    {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </TextField>
            ),
        },
        {
            field: 'groups', headerName: 'Groups', flex: 1,
            renderCell: (params: any) => (
                <TextField select size="small"
                           SelectProps={{
                               multiple: true,
                               renderValue: (selected: any) => (
                                   <Stack direction="row" spacing={0.5} sx={{flexWrap: 'wrap', gap: 0.5}}>
                                       {(selected as string[]).map(s => <Chip key={s} size="small" label={s} variant="outlined"/>)}
                                   </Stack>
                               ),
                           }}
                           value={params.row.groups}
                           disabled={!isAdmin}
                           onChange={(e: any) => assignGroups(params.row.username, e.target.value as string[])}
                           sx={{minWidth: 200}}>
                    {groups.map(g => (
                        <MenuItem key={g.name} value={g.name}>
                            <Checkbox checked={params.row.groups.includes(g.name)} size="small" sx={{p: 0.5}}/>
                            <ListItemText primary={g.name} secondary={`${g.members.length} member(s)`}/>
                        </MenuItem>
                    ))}
                </TextField>
            ),
        },
        {
            field: 'last_login', headerName: 'Last login', width: 150,
            valueGetter: (_v, row: any) => row.last_login
                ? new Date(row.last_login).toLocaleString() : 'never',
        },
        {
            field: 'is_active', headerName: 'Active', width: 90, type: 'boolean',
            renderCell: (params: any) => (
                <Tooltip title={params.row.username === me
                    ? 'You cannot deactivate your own account'
                    : params.value ? 'Click to deactivate' : 'Click to reactivate'}>
                    <span>
                        <IconButton size="small"
                                    disabled={params.row.username === me || !isAdmin}
                                    onClick={() => toggleActive(params.row.username, !params.value)}>
                            {params.value ? <Person fontSize="small" color="success"/>
                                          : <PersonOff fontSize="small" color="disabled"/>}
                        </IconButton>
                    </span>
                </Tooltip>
            ),
        },
        {
            field: 'actions', type: 'actions', getActions: (params: any) => [
                <GridActionsCellItem
                    icon={<Key fontSize="small"/>} label="Change password"
                    onClick={() => setPwUser(params.row.username)}
                    key="pw"/>,
                <GridActionsCellItem
                    icon={<Delete fontSize="small"/>} label="Delete user"
                    onClick={() => deleteUser(params.row.username)}
                    key="del"
                    // superusers are protected backend-side; don't offer it
                    showInMenu disabled={params.row.is_superuser}/>,
            ],
        },
    ]

    if (!isAdmin && !isAdminLoading) {
        return (
            <PageContainer>
                <Alert severity="info" sx={{mt: 2}}>
                    User and group management is restricted to administrators.
                </Alert>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 1}}>
                <Person/>
                <Typography variant="h6">Users &amp; Groups</Typography>
                <Box sx={{flex: 1}}/>
                <Button variant="outlined" startIcon={<Add/>} onClick={() => setCreateOpen(true)}>
                    New user
                </Button>
            </Stack>

            {error && <Alert severity="error" sx={{mb: 1}} onClose={() => setError(null)}>{error}</Alert>}

            <Tabs value={tab} onChange={(_e, v) => setTab(v)}>
                <Tab icon={<Person/>} iconPosition="start" label={`Users (${users.length})`}/>
                <Tab icon={<GroupIcon/>} iconPosition="start" label={`Groups (${groups.length})`}/>
            </Tabs>
            <Divider sx={{mb: 1}}/>

            {tab === 0 && (
                <div style={{height: 'calc(100vh - 280px)', minHeight: 400}}>
                    <DataGrid
                        columns={userColumns}
                        rows={users}
                        getRowId={(row: any) => row.username}
                        loading={isLoading}
                        showToolbar
                        localeText={{noRowsLabel: 'No user found'}}
                        initialState={{pagination: {paginationModel: {pageSize: 25}}}}
                    />
                </div>
            )}

            {tab === 1 && (
                <Stack spacing={2} sx={{maxWidth: 700}}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField label="New group name" size="small" value={newGroupName}
                                   onChange={e => setNewGroupName(e.target.value)}
                                   sx={{flex: 1}}/>
                        <Button startIcon={<Add/>} onClick={createGroup}
                                disabled={newGroupName.trim() === ''}>
                            Create
                        </Button>
                    </Stack>
                    {groups.map(g => (
                        <Card key={g.name} variant="outlined">
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{p: 1.5}}>
                                <GroupIcon fontSize="small" color="action"/>
                                <Typography variant="body1" sx={{minWidth: 140}}>{g.name}</Typography>
                                <Chip size="small" variant="outlined" label={`${g.members.length} member(s)`}/>
                                <Box sx={{flex: 1}}/>
                                <Typography variant="caption" color="text.secondary" noWrap>
                                    {g.members.join(', ') || '—'}
                                </Typography>
                                <IconButton size="small" onClick={() => deleteGroup(g.name)}>
                                    <Delete fontSize="small"/>
                                </IconButton>
                            </Stack>
                        </Card>
                    ))}
                    {groups.length === 0 && !isLoading && (
                        <Typography variant="body2" color="text.secondary" sx={{py: 4, textAlign: 'center'}}>
                            No group yet — groups can organize teams (e.g. « responders », « auditors »).
                        </Typography>
                    )}
                </Stack>
            )}

            <CreateUserDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreated={load}/>
            <ChangePasswordDialog open={pwUser !== null} username={pwUser}
                                  onClose={() => setPwUser(null)} onChanged={load}/>
        </PageContainer>
    )
}
