import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import APIProvider from './Components/API/APIProvider';
import { Cookies } from 'react-cookie';
import { StyledEngineProvider } from '@mui/material/styles';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const cookies = new Cookies();

const queryClient = new QueryClient( {
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 min
    },
  },
} );

root.render(
  <React.StrictMode>
    <QueryClientProvider client={ queryClient } >
      <APIProvider cookies={ cookies } >
        <StyledEngineProvider injectFirst>
          <App />
        </StyledEngineProvider>
      </APIProvider>
    </QueryClientProvider>
  </React.StrictMode>
);