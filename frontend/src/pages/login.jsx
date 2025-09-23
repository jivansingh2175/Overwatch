





// src/pages/login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      const { token, user } = res.data;

      // localStorage.setItem('token', token);
      // localStorage.setItem('user', JSON.stringify(user));
      // localStorage.setItem('role', user.role); // ✅ Store role for routing

localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
localStorage.setItem('role', user.role);
localStorage.setItem('userId', user._id); // ✅ This line fixes your dashboard issue






      alert('Login successful!');
      localStorage.setItem('userId', user._id);


      // 🔀 Redirect based on role
      if (user.role === 'superadmin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
