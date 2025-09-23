// import React, { useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000'); // Backend

// const UserScreenShare = ({ device_id, access_key }) => {
//   useEffect(() => {
//     socket.emit('register_device', { device_id, access_key });

//     navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
//       const track = stream.getVideoTracks()[0];
//       const imageCapture = new ImageCapture(track);

//       setInterval(async () => {
//         const bitmap = await imageCapture.grabFrame();
//         const canvas = document.createElement('canvas');
//         canvas.width = bitmap.width;
//         canvas.height = bitmap.height;
//         canvas.getContext('2d').drawImage(bitmap, 0, 0);
//         canvas.toBlob((blob) => {
//           blob.arrayBuffer().then((buf) => {
//             socket.emit('screen-data', { device_id, data: buf });
//           });
//         }, 'image/jpeg');
//       }, 1000);
//     });
//   }, []);

//   return <h2>Screen Sharing Active</h2>;
// };

// export default UserScreenShare;




import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './userScreenShare.css';

const socket = io('http://localhost:5000');

const UserScreenShare = ({ device_id, access_key }) => {
  const [status, setStatus] = useState('Connecting...');
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let intervalId;
    let stream;

    const startSharing = async () => {
      try {
        // Register device first
        socket.emit('register_device', { device_id, access_key });
        
        // Get screen capture
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 15 },
          audio: false
        });
        
        setStatus('Screen sharing active');
        setIsSharing(true);
        
        const track = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);
        
        intervalId = setInterval(async () => {
          try {
            const bitmap = await imageCapture.grabFrame();
            const canvas = document.createElement('canvas');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bitmap, 0, 0);
            
            canvas.toBlob((blob) => {
              blob.arrayBuffer().then((buf) => {
                socket.emit('screen-data', {
                  device_id,
                  image: buf,
                  timestamp: Date.now()
                });
              });
            }, 'image/jpeg', 0.7); // 70% quality to reduce bandwidth
          } catch (err) {
            console.error('Capture error:', err);
          }
        }, 200); // 5 FPS

        track.onended = () => {
          stopSharing();
          setStatus('Screen sharing stopped by user');
        };
      } catch (err) {
        console.error('Sharing error:', err);
        setError('Failed to start screen sharing');
        setStatus('Error occurred');
      }
    };

    const stopSharing = () => {
      if (intervalId) clearInterval(intervalId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsSharing(false);
      socket.emit('stop-sharing', { device_id });
    };

    socket.on('connect', () => {
      setStatus('Connected to server');
      startSharing();
    });

    socket.on('disconnect', () => {
      setStatus('Disconnected from server');
      stopSharing();
    });

    socket.on('error', (err) => {
      setError(err.message);
      setStatus('Connection error');
    });

    return () => {
      stopSharing();
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
      socket.disconnect();
    };
  }, [device_id, access_key]);

  return (
    <div className="screen-share-container">
      <div className="status-bar">
        <div className={`status ${isSharing ? 'active' : 'inactive'}`}>
          {status}
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
      {isSharing && (
        <div className="sharing-info">
          <p>You are sharing your screen to device: {device_id}</p>
          <p>Press the browser's stop sharing button to end the session</p>
        </div>
      )}
    </div>
  );
};

export default UserScreenShare;