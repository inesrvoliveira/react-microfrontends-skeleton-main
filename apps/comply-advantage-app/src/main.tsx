import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AppThemeProvider from '../src/theme/AppThemeProvider';
import App from './components/App/App.tsx';
import './styles-reset.css';

import setupMocks from './mockApi/setupMocks';

const CaseListView = React.lazy(() =>
  import('cases').then((module) => ({ default: module.CaseListView })),
);
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'cases',
        element: (
          <Suspense fallback={<div>...</div>}>
            <CaseListView />
          </Suspense>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

async function main() {
  await setupMocks();

  root.render(
    <React.StrictMode>
      <AppThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AppThemeProvider>
    </React.StrictMode>,
  );
}

main();
