import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet, useNavigate } from 'react-router';
import type { Navigation, Session } from '@toolpad/core/AppProvider';
import { SessionContext } from './SessionContext';
import { BugReport, Computer, Extension, Settings, Timeline, Topic,DataObject } from '@mui/icons-material';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: '',
  },
  {
    segment: 'case',
    title: 'Case',
    icon: <DashboardIcon />,
  },
  {
    segment: 'source',
    title: 'Sources',
    icon: <Computer/>
  },
  {
    segment: 'filesystem',
    title: 'File System',
    icon: <Topic/>
  },
  {
    segment: 'artefact',
    title: 'Artefacts',
    icon: <Extension/>
  },
  {
    segment: 'ioc',
    title: 'IOC',
    icon: <BugReport/>
  },
  {
    segment: 'timeline',
    title: 'Chronologie',
    icon: <Timeline/>
  },
  {
    segment: 'yara',
    title: 'Yara',
    icon: <DataObject/>
  },
  {
    kind: 'divider'
  },
  {
    kind: 'header',
    title: 'Administration',
  },
  {
    segment: 'parametre',
    title: 'Parametres',
    icon: <Settings />,
  },
];

const BRANDING = {
  logo:<img src="/icon.svg" alt="DisWeb Logo"/>,
  title: "DisWeb",
};

export default function App() {
  const [session, setSession] = React.useState<Session | null>(null);
  
  const navigate = useNavigate();

  const signIn = React.useCallback(() => {
    navigate('/sign-in');
  }, [navigate]);

  const signOut = React.useCallback(() => {
    setSession(null);
    navigate('/sign-in');
  }, [navigate]);

  const sessionContextValue = React.useMemo(() => ({ session, setSession }), [session, setSession]);
  

  return (
    <SessionContext.Provider value={sessionContextValue} >
      <ReactRouterAppProvider
        navigation={NAVIGATION}
        branding={BRANDING}
        session={session}
        authentication={{ signIn, signOut }}
      >
        <Outlet />
      </ReactRouterAppProvider>
    </SessionContext.Provider>
  );
}
