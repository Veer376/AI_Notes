import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import Home from './screens/home';
import './index.css';
import Login from './screens/login';
import Register from './screens/register';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {AuthProvider, useAuth} from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Wait for the server to start...</div>;
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
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MantineProvider>
  );
}
