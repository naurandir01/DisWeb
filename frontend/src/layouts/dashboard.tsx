import * as React from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useSession } from '../SessionContext';
import { Avatar, Box, Chip, Divider, IconButton, ListItemIcon, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material';
import { useDialogs, useSessionStorageState, useNotifications } from '@toolpad/core';
import { BugReport, Logout, Person } from '@mui/icons-material';
import { IocDialog } from '../components/ioc/addioc';
import API from '../components/api/axios'
import Cookies from 'js-cookie';

export default function Layout() {
  const { session } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
  const [ioctypes,setIocTypes] = useSessionStorageState('ioctypes','')
  const dialog = useDialogs()
  const addIoc = IocDialog

  // User menu (the default Toolpad Account menu was previously REPLACED by
  // the custom toolbarActions slot — hence no avatar / no sign-out at all)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const [me, setMe] = React.useState<{username: string, role: string} | null>(null)

  React.useEffect(() => {
    (async () => {
      try {
        const res = await API.get('/users/me/')
        setMe({username: res.data.username, role: res.data.role})
      } catch {
        setMe(null)
      }
    })()
  }, [])

  const handleSignOut = React.useCallback(() => {
    // Purge the JWT cookies so the next visit requires a fresh login
    // (the backend-side token blacklist is a future improvement — see
    // /api/token/blacklist/ in settings)
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
    setAnchorEl(null)
    navigate('/sign-in')
  }, [navigate])

  function caseDiplay(){
    return(
      <Stack direction='row' spacing={1} alignItems="center">
        <Chip label={JSON.parse(currentCas||"{}").case_name === undefined ? "SELECT A CASE" :"CASE: "+ JSON.parse(currentCas||"{}").case_name}/>
        <Tooltip title="ADD IOC">
          <IconButton onClick={()=>dialog.open(addIoc)}>
            <BugReport/>
          </IconButton>
        </Tooltip>
        <ThemeSwitcher/>
        <Tooltip title={me ? `${me.username} (${me.role})` : 'Account'}>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" sx={{ml: 1}}>
            <Avatar sx={{width: 32, height: 32}}>
              {me?.username?.charAt(0).toUpperCase() ?? <Person fontSize="small"/>}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Stack>
    )
  }

  const userMenu = (
    <Menu
      anchorEl={anchorEl}
      open={anchorEl !== null}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      transformOrigin={{horizontal: 'right', vertical: 'top'}}
    >
      {me && (
        <Box sx={{px: 2, py: 1}}>
          <Typography variant="body2" sx={{fontWeight: 600}}>{me.username}</Typography>
          <Typography variant="caption" color="text.secondary">{me.role}</Typography>
        </Box>
      )}
      <Divider/>
      <MenuItem onClick={handleSignOut}>
        <ListItemIcon><Logout fontSize="small"/></ListItemIcon>
        Sign out
      </MenuItem>
    </Menu>
  )

  if (!session) {
    // Add the `callbackUrl` search parameter
    const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(location.pathname)}`;

    return <Navigate to={redirectTo} replace />;
  }



  return (
    <DashboardLayout slots={{toolbarActions:caseDiplay}} sx={{maxWidth:'inherit'}}>
      {userMenu}
      {/* <PageContainer sx={{margin:'0px',maxWidth:'inherit'}}>
        <Outlet />
      </PageContainer> */}
       <Outlet />
    </DashboardLayout>
  );
}
