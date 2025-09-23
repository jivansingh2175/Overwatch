



// export default Signup;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    clientId: ''
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:5000/api/user/clients', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setClients(res.data);
      } catch (err) {
        console.error('Failed to fetch clients:', err.message);
      }
    };

    fetchClients();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));

      // Determine role-based clientId override
      if (currentUser?.role === 'client') {
        form.clientId = currentUser._id;
        if (form.role !== 'user') throw new Error('Clients can only create regular users');
      }

      if ((form.role === 'client' || form.role === 'superadmin') && currentUser?.role !== 'superadmin') {
        throw new Error('Only superadmins can create other clients or superadmins');
      }

      const token = localStorage.getItem('token');

      await axios.post('http://localhost:5000/api/auth/signup', form, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      alert('Registration successful. Please login.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Signup failed';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Register</h2>
      <form onSubmit={handleSubmit} className="signup-form" autoComplete="on">
        <input
          name="name"
          placeholder="Full Name"
          className="signup-input"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="signup-input"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="signup-input"
          value={form.password}
          onChange={handleChange}
          required
          minLength="8"
          autoComplete="new-password"
        />

        <select
          name="role"
          className="signup-input"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="user">User</option>
          <option value="client">Client</option>
          <option value="superadmin">Super Admin</option>
        </select>

        {form.role === 'user' && clients.length > 0 && (
          <select
            name="clientId"
            className="signup-input"
            value={form.clientId}
            onChange={handleChange}
          >
            <option value="">Select Client Organization</option>
            {clients.map(client => (
              <option key={client._id} value={client._id}>
                {client.name} ({client.email})
              </option>
            ))}
          </select>
        )}

        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
