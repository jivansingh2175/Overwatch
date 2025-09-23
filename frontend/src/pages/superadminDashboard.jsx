


import React, { useEffect, useState } from 'react';
import './superadminDashboard.css';

const SuperadminDashboard = () => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  // Fetch existing clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/superadmin/clients', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }

        const data = await response.json();
        setClients(data.clients || []);
      } catch (error) {
        console.error('Error fetching clients:', error.message);
      }
    };

    fetchClients();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/superadmin/create-client', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, role: 'client' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create client');
      }

      // Success: reset form and reload clients
      setMessage('Client created successfully');
      setFormData({ name: '', email: '', password: '' });
      setClients((prev) => [...prev, data.client]);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="superadmin-dashboard">
      <h2 className="title">Superadmin Dashboard</h2>

      {/* Client Creation Form */}
      <div className="form-container">
        <h3>Create New Client</h3>
        <form onSubmit={handleSubmit} className="create-client-form">
          <input
            type="text"
            name="name"
            placeholder="Client Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Client Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Client Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Create Client</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>

      {/* Registered Clients */}
      <div className="client-list">
        <h3>Registered Clients</h3>
        {clients.length === 0 ? (
          <p>No clients registered.</p>
        ) : (
          <ul>
           {clients
  .filter(client => client && client.name && client.email) // skip bad entries
  .map((client) => (
    <li key={client._id} className="client-item">
      <strong>Name:</strong> {client.name} <br />
      <strong>Email:</strong> {client.email}
    </li>
))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SuperadminDashboard;
