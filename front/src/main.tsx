import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import CasPage from './pages/case';
import SignInPage from './pages/signIn';
import Sources from './pages/source';
import SystemDeFichier from './pages/filesystem';
import Artefacts from './pages/artefact';
import IOC from './pages/ioc';
import Parametres from './pages/parametre';
import Chronologie from './pages/chronologie';
import '../src/assets/App.css'
import Yara from './pages/yara';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '/',
            Component: DashboardPage,
          },
          {
            path: '/case',
            Component: CasPage,
          },
          {
            path: '/source',
            Component: Sources,
          },
          {
            path: '/filesystem',
            Component: SystemDeFichier,
          },
          {
            path: '/artefact',
            Component: Artefacts,
          },
          {
            path: '/ioc',
            Component: IOC,
          },
          {
            path: '/timeline',
            Component: Chronologie,
          },
          {
            path:"/yara",
            Component:Yara,
          },
          {
            path: '/parametre',
            Component: Parametres,
          }
        ],
      },
      {
        path: '/sign-in',
        Component: SignInPage,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode >
      <RouterProvider router={router} />
  </React.StrictMode>,
);
