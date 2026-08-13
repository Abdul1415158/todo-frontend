import React from 'react'
import Login from '../pages/Login';
import Register from '../pages/Register';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Dashboard';


const App = () => {
  return (

    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/dashboard' element={
        <ProectedRoute>
          <Dashboard />
        </ProectedRoute>
      } />
      <Route path='*' element={<Navigate to="/login" replace />} />
    </Routes>

  )
}

export default App