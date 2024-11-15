import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import Home from './screens/home'; // Use relative path if alias is not configured
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Import RouterProvider

const paths = [
  {
    path: '/',
    element: (<Home />),
  },
];

const router = createBrowserRouter(paths); // Corrected usage

export default function App() {
  return (
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
    );
}
