import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StudentsPage from './pages/StudentsPage';
import SummaryPage from './pages/SummaryPage';

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to='/login' />;
}

export default function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/students' element={<RequireAuth><StudentsPage /></RequireAuth>} />
      <Route path='/summary' element={<RequireAuth><SummaryPage /></RequireAuth>} />
      <Route path='/' element={<Navigate to='/students' />} />
    </Routes>
  );
}
