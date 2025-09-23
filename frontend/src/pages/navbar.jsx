

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUserEmail(user.email || '');
      setUserRole(user.role || '');
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title">Overwatch</Link>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Dashboard</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="navbar-link">Admin Panel</Link>
        )}
        <Link to="/viewer" className="navbar-link">Viewer</Link>

        {user ? (
          <>
            <span className="navbar-user-email">
              👤 {userEmail} ({userRole})
            </span>
            <button onClick={handleLogout} className="navbar-link logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/signup" className="navbar-link">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};


export default Navbar;
