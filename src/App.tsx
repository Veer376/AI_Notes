import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import Home from './screens/home';
import './index.css';
import Login from './screens/login';
import Register from './screens/register';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {AuthProvider, useAuth} from './context/authContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  console.log(user);
  return user===null? <Navigate to="/login" replace /> : <> {children} </>;
  
};

export default function App() {
  return (
    <MantineProvider>
      <AuthProvider>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute> <Home/> </ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sidebar" element={<Sidebar />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MantineProvider>
  );
}
