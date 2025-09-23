// Frontend/components/StartSharingScreen.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './startSharingScreen.css';

const socket = io('http://localhost:5000'); // change if needed

const StartSharingScreen = ({ deviceId }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    socket.on('device_registered', ({ device_id }) => {
      console.log(`✅ Registered device: ${device_id}`);
    });

    socket.on('error', (err) => {
      console.error('❌ Socket error:', err);
      setStatus(`Error: ${err}`);
    });

    return () => {
      socket.off('device_registered');
      socket.off('error');
    };
  }, []);

  const startSharing = async () => {
    try {
      const access_key = prompt("Enter access key for device:"); // Optional
      socket.emit('register_device', { device_id: deviceId, access_key });

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = 1280;
      canvas.height = 720;

      setIsSharing(true);
      setStatus('🔴 Sharing screen...');

      const intervalId = setInterval(() => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL('image/jpeg', 0.5);
        socket.emit('screen-data', { device_id: deviceId, image });
      }, 1000); // 1 frame per second

      stream.getVideoTracks()[0].onended = () => {
        clearInterval(intervalId);
        setIsSharing(false);
        setStatus('🟢 Sharing stopped');
        console.log('Screen sharing ended');
      };
    } catch (err) {
      console.error('Failed to share screen:', err);
      setStatus('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="screen-share-container">
      <h2>Share Your Screen</h2>
      {!isSharing ? (
        <button className="start-button" onClick={startSharing}>
          Start Sharing
        </button>
      ) : (
        <p>{status}</p>
      )}
    </div>
  );
};

export default StartSharingScreen;
