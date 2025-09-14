import * as React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useSession } from '../SessionContext';
import { Chip, IconButton, Stack, Tooltip } from '@mui/material';
import { useDialogs, useSessionStorageState, useNotifications } from '@toolpad/core';
import { BugReport } from '@mui/icons-material';
import { IocDialog } from '../components/ioc/addioc';
import API from '../components/api/axios'

export default function Layout() {
  const { session } = useSession();
  const location = useLocation();
  const [currentCas,setCurrentCas] = useSessionStorageState('cas','')
  const [ioctypes,setIocTypes] = useSessionStorageState('ioctypes','')
  const dialog = useDialogs()
  const addIoc = IocDialog


  function caseDiplay(){
    return(
      <Stack direction='row' spacing={1}>
        <Chip label={JSON.parse(currentCas||"{}").case_name === undefined ? "SELECT A CASE" :"CASE: "+ JSON.parse(currentCas||"{}").case_name}/>
        <Tooltip title="ADD IOC">
          <IconButton onClick={()=>dialog.open(addIoc)}>
            <BugReport/>
          </IconButton>
        </Tooltip>
        <ThemeSwitcher/>
      </Stack>
    )
  }

  if (!session) {
    // Add the `callbackUrl` search parameter
    const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(location.pathname)}`;

    return <Navigate to={redirectTo} replace />;
  }

   

  return (
    <DashboardLayout slots={{toolbarActions:caseDiplay}} sx={{maxWidth:'inherit'}}>
      {/* <PageContainer sx={{margin:'0px',maxWidth:'inherit'}}>
        <Outlet />
      </PageContainer> */}
       <Outlet />
    </DashboardLayout>
  );
}
