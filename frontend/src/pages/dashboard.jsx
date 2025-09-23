

// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeviceViewer from './deviceViewer';
// import Navbar from './navbar.jsx';
import './dashboard.css';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/device/all', {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Correct format
          },
        });
        setDevices(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch devices');
      }
    };
    fetchDevices();
  }, [token]);

  if (selectedDevice) {
    return <DeviceViewer deviceId={selectedDevice} />;
  }

  return (
    <div className="dashboard-container">
      {/* <Navbar /> */}

      <header className="dashboard-header">
        <p className="dashboard-subtitle">Device Monitoring Dashboard</p>
      </header>

      <section>
        <h2 className="dashboard-section-title">Available Devices</h2>

        {devices.length === 0 ? (
          <p className="dashboard-empty">No devices available.</p>
        ) : (
          <div className="device-grid">
            {devices.map((dev) => (
              <div key={dev.device_id} className="device-card">
                <div>
                  <h3 className="device-name">{dev.name}</h3>
                  <p className="device-id">ID: {dev.device_id}</p>
                </div>
                <div className="device-status-row">
                  <span className={`device-status ${dev.online ? 'online' : 'offline'}`}>
                    {dev.online ? '🟢 Online' : '🔴 Offline'}
                  </span>
                  {dev.online && (
                    <button
                      onClick={() => setSelectedDevice(dev.device_id)}
                      className="connect-button"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
