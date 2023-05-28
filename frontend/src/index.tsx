import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { appTheme } from './styles/appTheme';
import { GlobalStyles } from './styles/GlobalStyles';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { BikeStationListPage } from './components/bike_stations/list/BikeStationListPage';
import { JourneyListPage } from './components/journeys/JourneyListPage';
import { BikeStationDetailPage } from './components/bike_stations/detail/BikeStationDetailPage';

const router = createBrowserRouter([
  {
    path: '/journeys',
    element: <JourneyListPage />,
  },
  {
    path: '/bike-stations/:id',
    element: <BikeStationDetailPage />,
  },
  {
    path: '/bike-stations',
    element: <BikeStationListPage />,
  },
  {
    path: '*',
    element: <Navigate to={'/journeys'} replace />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <GlobalStyles />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
