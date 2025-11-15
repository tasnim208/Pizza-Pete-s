import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
<></>

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Navigate to={
              isAuthenticated 
                ? (user?.isAdmin ? "/admin" : "/home") 
                : "/login"
            } />} 
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/home" 
          element={
            isAuthenticated ? <Home /> : <Navigate to="/login" />
          } 
        />
         <Route 
          path="/profile" 
          element={
            isAuthenticated ? <Profile /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/admin" 
          element={
            isAuthenticated && user?.isAdmin ? <Admin /> : <Navigate to="/home" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

