import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";

import './index.css'
import NotFound from "./components/NotFound/NotFound";

import MainPage from "./pages/MainPage/MainPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import AccessLogPage from './pages/AccessLogPage/AccessLogPage.tsx';
import UsersPage from './pages/UsersPage/UsersPage.tsx';
import SearchPage from './pages/SearchPage/SearchPage.tsx';
import AccessEditorPage from './pages/AccessEditorPage/AccessEditorPage.tsx';
import MapPage from './pages/MapPage/MapPage.tsx';
import SettingsPage from './pages/SettingsPage/SettingsPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <MainPage />
      },
      {
        path: '/auth',
        element: <AuthPage />
      },
      {
        path: '/accesslog',
        element: <AccessLogPage />
      },
      {
        path: '/users',
        element: <UsersPage />
      },
      {
        path: '/search',
        element: <SearchPage />
      },
      {
        path: '/accesseditor',
        element: <AccessEditorPage />
      },
      {
        path: '/maps',
        element: <MapPage />
      },
      {
        path: '/settings',
        element: <SettingsPage />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
    <RouterProvider router={router} />
    {/* </Provider> */}
  </React.StrictMode>,
)
