


import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './adminViewer.css';

const socket = io('http://localhost:5000');

const AdminViewer = () => {
  const { deviceId } = useParams();
  const imgRef = useRef(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Verify device access first
    const verifyAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/device/status/${deviceId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDeviceInfo(res.data);
        
        // Only connect if authorized
        socket.emit('watch', deviceId);
        setIsConnected(true);
      } catch (err) {
        setError('You are not authorized to view this device');
      }
    };

    verifyAccess();

    socket.on('screen-data', ({ image }) => {
      const blob = new Blob([image], { type: 'image/jpeg' });
      imgRef.current.src = URL.createObjectURL(blob);
    });

    socket.on('connect_error', () => {
      setError('Connection failed');
    });

    return () => {
      socket.off('screen-data');
      socket.off('connect_error');
      if (isConnected) {
        socket.emit('unwatch', deviceId);
      }
    };
  }, [deviceId, isConnected]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!deviceInfo) {
    return <div className="loading-message">Loading device information...</div>;
  }

  return (
    <div className="viewer-container">
      <div className="viewer-header">
        <h2>Live Screen: {deviceInfo.name} ({deviceInfo.device_id})</h2>
        <div className={`status-indicator ${deviceInfo.online ? 'online' : 'offline'}`}>
          {deviceInfo.online ? '🟢 Online' : '🔴 Offline'}
        </div>
      </div>
      {deviceInfo.online ? (
        <img 
          ref={imgRef} 
          className="screen-image" 
          alt="Live screen share" 
        />
      ) : (
        <div className="offline-message">
          Device is currently offline. Last seen: {new Date(deviceInfo.last_seen).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default AdminViewer;