import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ScreenSender = ({ deviceId, accessKey }) => {
  const videoRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);

  const registerDevice = () => {
    socket.emit('register_device', { device_id: deviceId, access_key: accessKey });

    socket.on('device_registered', () => {
      console.log("✅ Device registered for screen sharing");
      setIsSharing(true);
    });

    socket.on('error', (msg) => {
      alert("Error: " + msg);
    });
  };

  useEffect(() => {
    if (!isSharing) return;

    const startSharing = async () => {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      const sendFrame = () => {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL('image/jpeg', 0.5);
        socket.emit('screen-data', { device_id: deviceId, image });
      };

      const interval = setInterval(sendFrame, 500);

      return () => {
        clearInterval(interval);
        stream.getTracks().forEach(track => track.stop());
      };
    };

    startSharing();
  }, [isSharing, deviceId]);

  return (
    <div>
      {!isSharing && (
        <button onClick={registerDevice}>Start Sharing Screen</button>
      )}
      {isSharing && <p>🟢 Screen sharing for device: {deviceId}</p>}
      <video ref={videoRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ScreenSender;
