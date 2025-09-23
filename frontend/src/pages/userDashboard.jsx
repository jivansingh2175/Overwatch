// // Frontend/pages/UserDashboard.jsx
// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000');

// const UserDashboard = () => {
//   const [device, setDevice] = useState(null);
//   const [sharing, setSharing] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchDevice = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await fetch('http://localhost:5000/api/devices/list', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         const data = await res.json();
//         if (!data.success) throw new Error(data.error || 'Failed to fetch device');
//         if (data.data.length === 0) throw new Error('No devices assigned');
//         setDevice(data.data[0]); // You can support multiple later
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchDevice();
//   }, []);

//   useEffect(() => {
//     socket.on('device_registered', () => {
//       console.log('✅ Device registered on socket');
//       startSendingFrames();
//     });

//     return () => {
//       socket.off('device_registered');
//     };
//   }, []);

//   const handleStartSharing = () => {
//     if (!device) return setError('No device found');
//     socket.emit('register_device', {
//       device_id: device.device_id,
//       access_key: device.access_key // Replace with how you're storing/handling this
//     });
//     setSharing(true);
//   };

//   const startSendingFrames = () => {
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');

//     const capture = () => {
//       try {
//         navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
//           const video = document.createElement('video');
//           video.srcObject = stream;
//           video.play();

//           const sendFrame = () => {
//             if (!sharing) return;
//             context.drawImage(video, 0, 0, canvas.width, canvas.height);
//             const image = canvas.toDataURL('image/jpeg');
//             socket.emit('screen-data', {
//               device_id: device.device_id,
//               image
//             });
//             requestAnimationFrame(sendFrame);
//           };

//           sendFrame();
//         });
//       } catch (e) {
//         console.error('Screen capture failed:', e);
//         setError('Screen capture not allowed or failed.');
//       }
//     };

//     capture();
//   };

//   return (
//     <div className="user-dashboard p-6">
//       <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
//       {error && <p className="text-red-600">{error}</p>}
//       {device ? (
//         <div className="bg-white shadow p-4 rounded">
//           <p><strong>Device Name:</strong> {device.name}</p>
//           <p><strong>Device ID:</strong> {device.device_id}</p>
//           <p><strong>Status:</strong> {device.online ? '🟢 Online' : '🔴 Offline'}</p>

//           <button
//             onClick={handleStartSharing}
//             className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
//             disabled={sharing}
//           >
//             {sharing ? '🔴 Sharing Live' : '▶️ Start Sharing'}
//           </button>
//         </div>
//       ) : (
//         <p>Loading device info...</p>
//       )}
//     </div>
//   );
// };

// export default UserDashboard;





// // frontend/pages/UserDashboard.jsx
// import React, {useState } from 'react';
// import './userDashboard.css';
// import io from 'socket.io-client';
// // import axios from 'axios';


// const socket = io('http://localhost:5000');

// const UserDashboard = () => {
//   const [deviceId, setDeviceId] = useState('');
//   const [accessKey, setAccessKey] = useState('');
//   const [streaming, setStreaming] = useState(false);
//   const [stream, setStream] = useState(null);

//   const handleStartSharing = async () => {
//     if (!deviceId || !accessKey) return alert('Device ID and Access Key required');

//     try {
//       const mediaStream = await navigator.mediaDevices.getDisplayMedia({
//         video: { mediaSource: 'screen' }
//       });

//       setStream(mediaStream);
//       setStreaming(true);

//       // Register device via socket
//       socket.emit('register_device', { device_id: deviceId, access_key: accessKey });

//       const video = document.createElement('video');
//       video.srcObject = mediaStream;
//       await video.play();

//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');

//       const sendFrame = () => {
//         if (!streaming) return;
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//         const image = canvas.toDataURL('image/jpeg', 0.4);
//         socket.emit('screen-data', { device_id: deviceId, image });
//         requestAnimationFrame(sendFrame);
//       };

//       sendFrame();
//     } catch (err) {
//       console.error('Screen share error:', err);
//       alert('Error starting screen share');
//     }
//   };

//   const handleStopSharing = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//     setStreaming(false);
//   };

//   return (
//     <div className="user-dashboard">
//       <h2>User Dashboard</h2>
//       <input
//         type="text"
//         placeholder="Device ID"
//         value={deviceId}
//         onChange={(e) => setDeviceId(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Access Key"
//         value={accessKey}
//         onChange={(e) => setAccessKey(e.target.value)}
//       />
//       <button onClick={streaming ? handleStopSharing : handleStartSharing}>
//         {streaming ? 'Stop Sharing' : 'Start Sharing'}
//       </button>
//     </div>
//   );
// };

// export default UserDashboard;





// import React, { useState } from "react";
// import "./userDashboard.css";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000");

// // Helper: Generate a random 6-digit PIN
// const generatePIN = () => Math.floor(100000 + Math.random() * 900000).toString();

// const UserDashboard = () => {
//   const [deviceId, setDeviceId] = useState("");
//   const [accessKey, setAccessKey] = useState("");
//   const [streaming, setStreaming] = useState(false);
//   const [stream, setStream] = useState(null);

//   const handleStartSharing = async () => {
//     if (!deviceId) return alert("Device ID is required");

//     try {
//       const generatedKey = generatePIN();
//       setAccessKey(generatedKey);

//       const mediaStream = await navigator.mediaDevices.getDisplayMedia({
//         video: { mediaSource: "screen" },
//       });

//       setStream(mediaStream);
//       setStreaming(true);

//       // Register with backend (Device + Access Key)
//       socket.emit("register_device", { device_id: deviceId, access_key: generatedKey });

//       const video = document.createElement("video");
//       video.srcObject = mediaStream;
//       await video.play();

//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");

//       const sendFrame = () => {
//         if (!streaming) return;
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//         const image = canvas.toDataURL("image/jpeg", 0.4);
//         socket.emit("screen-data", { device_id: deviceId, image });
//         requestAnimationFrame(sendFrame);
//       };

//       sendFrame();
//     } catch (err) {
//       console.error("Screen share error:", err);
//       alert("Error starting screen share");
//     }
//   };

//   const handleStopSharing = () => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       setStream(null);
//     }
//     setStreaming(false);
//   };

//   return (
//     <div className="user-dashboard">
//       <h2>User Dashboard</h2>

//       <input
//         type="text"
//         placeholder="Enter Device ID"
//         value={deviceId}
//         onChange={(e) => setDeviceId(e.target.value)}
//         disabled={streaming} // lock once streaming starts
//       />

//       <button onClick={streaming ? handleStopSharing : handleStartSharing}>
//         {streaming ? "Stop Sharing" : "Register & Share"}
//       </button>

//       {accessKey && streaming && (
//         <div className="device-key">
//           <p><strong>Your Access Key:</strong></p>
//           <h3 style={{ color: "green" }}>{accessKey}</h3>
//           <small>Share this key with viewers to allow them to connect.</small>
//         </div>
//       )}
      
//     </div>
//   );
// };

// export default UserDashboard;









// import React, { useState, useEffect, useRef } from "react";
// import "./userDashboard.css";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000");

// const UserDashboard = () => {
//   const [deviceId, setDeviceId] = useState("");
//   const [deviceName, setDeviceName] = useState("");
//   const [streaming, setStreaming] = useState(false);
//   const [pin, setPin] = useState("");
//   const [error, setError] = useState("");
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const animationRef = useRef(null);

//   useEffect(() => {
//     socket.on("device_registered", ({ device_id, pin }) => {
//       setPin(pin);
//       console.log(`Device registered with PIN: ${pin}`);
//     });

//     socket.on("error", (message) => {
//       setError(message);
//       alert(`Error: ${message}`);
//     });

//     return () => {
//       socket.off("device_registered");
//       socket.off("error");
//       stopSharing();
//     };
//   }, []);

//  // In the captureFrame function, ensure proper image handling
// // In the captureFrame function, add this:


// // In UserDashboard.jsx - Update the captureFrame function
// const captureFrame = () => {
//   if (!streaming || !videoRef.current || !canvasRef.current) return;
  
//   const video = videoRef.current;
//   const canvas = canvasRef.current;
//   const ctx = canvas.getContext("2d");
  
//   if (video.videoWidth === 0 || video.videoHeight === 0) {
//     requestAnimationFrame(captureFrame);
//     return;
//   }
  
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
//   // Convert to JPEG with quality 0.7 for better performance
//   const imageData = canvas.toDataURL("image/jpeg", 0.7);
  
//   // ✅ Send screen data with proper format
//   socket.emit("screen-data", { 
//     device_id: deviceId, 
//     image: imageData 
//   });
  
//   // Throttle to 10 FPS (100ms interval)
//   setTimeout(() => {
//     animationRef.current = requestAnimationFrame(captureFrame);
//   }, 100);
// };

// // Update the start sharing function
// const handleStartSharing = async () => {
//   if (!deviceId) return alert("Device ID is required");
//   if (!deviceName) return alert("Device Name is required");
  
//   setError("");
  
//   try {
//     const mediaStream = await navigator.mediaDevices.getDisplayMedia({
//       video: { 
//         cursor: "always",
//         frameRate: 10 // Limit frame rate
//       },
//       audio: false
//     });
    
//     // Setup video element
//     if (videoRef.current) {
//       videoRef.current.srcObject = mediaStream;
//       await videoRef.current.play();
//     }
    
//     setStreaming(true);

//     // ✅ Register with backend - include access key if needed
//     socket.emit("register_device", { 
//       device_id: deviceId, 
//       name: deviceName
//       // Add access_key if your backend requires it
//     });

//     // Start capturing frames after video is ready
//     videoRef.current.onloadedmetadata = () => {
//       animationRef.current = requestAnimationFrame(captureFrame);
//     };
    
//     // Handle when the user stops sharing
//     mediaStream.getTracks().forEach(track => {
//       track.onended = () => {
//         stopSharing();
//       };
//     });
    
//   } catch (err) {
//     console.error("Screen share error:", err);
//     alert("Error starting screen share: " + err.message);
//   }
// };




// // const captureFrame = () => {
// //   if (!streaming || !videoRef.current || !canvasRef.current) return;
  
// //   const video = videoRef.current;
// //   const canvas = canvasRef.current;
// //   const ctx = canvas.getContext("2d");
  
// //   if (video.videoWidth === 0 || video.videoHeight === 0) {
// //     requestAnimationFrame(captureFrame);
// //     return;
// //   }
  
// //   canvas.width = video.videoWidth;
// //   canvas.height = video.videoHeight;
// //   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
// //   const imageData = canvas.toDataURL("image/jpeg", 0.5);
  
// //   // ✅ ADD DEBUG LOGGING
// //   console.log('Sending screen data to device:', deviceId);
// //   console.log('Image data size:', imageData.length, 'bytes');
// //   console.log('Image data preview:', imageData.substring(0, 50) + '...');
  
// //   socket.emit("screen-data", { 
// //     device_id: deviceId, 
// //     image: imageData 
// //   });
  
// //   setTimeout(() => {
// //     animationRef.current = requestAnimationFrame(captureFrame);
// //   }, 150);
// // };
// //   const handleStartSharing = async () => {
// //     if (!deviceId) return alert("Device ID is required");
// //     if (!deviceName) return alert("Device Name is required");
    
// //     setError("");
    
// //     try {
// //       const mediaStream = await navigator.mediaDevices.getDisplayMedia({
// //         video: { 
// //           cursor: "always",
// //           frameRate: 10
// //         },
// //         audio: false
// //       });
      
// //       // Setup video element
// //       if (videoRef.current) {
// //         videoRef.current.srcObject = mediaStream;
// //         await videoRef.current.play();
// //       }
      
// //       setStreaming(true);

// //       // Register with backend
// //       socket.emit("register_device", { 
// //         device_id: deviceId, 
// //         name: deviceName
// //       });

// //       // Start capturing frames after a short delay
// //       setTimeout(() => {
// //         animationRef.current = requestAnimationFrame(captureFrame);
// //       }, 500);
      
// //       // Handle when the user stops sharing
// //       mediaStream.getTracks().forEach(track => {
// //         track.onended = () => {
// //           stopSharing();
// //         };
// //       });
      
// //     } catch (err) {
// //       console.error("Screen share error:", err);
// //       alert("Error starting screen share: " + err.message);
// //     }
// //   };

//   const stopSharing = () => {
//     if (animationRef.current) {
//       cancelAnimationFrame(animationRef.current);
//       animationRef.current = null;
//     }
    
//     if (videoRef.current && videoRef.current.srcObject) {
//       videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//       videoRef.current.srcObject = null;
//     }
    
//     setStreaming(false);
//     setPin("");
//   };

//   return (
//     <div className="user-dashboard">
//       <h2>User Dashboard</h2>
      
//       {error && <div className="error-message">{error}</div>}
      
//       <div className="input-group">
//         <input 
//           type="text" 
//           placeholder="Enter Device ID" 
//           value={deviceId} 
//           onChange={(e) => setDeviceId(e.target.value)} 
//           disabled={streaming}
//         />
//         <input 
//           type="text" 
//           placeholder="Enter Device Name" 
//           value={deviceName} 
//           onChange={(e) => setDeviceName(e.target.value)} 
//           disabled={streaming}
//         />
//       </div>
      
//       <button onClick={streaming ? stopSharing : handleStartSharing}>
//         {streaming ? "Stop Sharing" : "Register & Share"}
//       </button>
      
//       {/* Hidden elements for screen capture */}
//       <video 
//         ref={videoRef} 
//         style={{display: 'none'}} 
//         autoPlay 
//         muted 
//       />
//       <canvas 
//         ref={canvasRef} 
//         style={{display: 'none'}} 
//       />
      
//       {streaming && pin && (
//         <div className="device-info">
//           <div className="pin-info">
//             <p><strong>Your PIN:</strong></p>
//             <h3 style={{ color: "blue" }}>{pin}</h3>
//             <small>Viewers can use this PIN to connect directly.</small>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserDashboard;







import React, { useState, useEffect, useRef } from "react";
import "./userDashboard.css";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const UserDashboard = () => {
  const [deviceId, setDeviceId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    // Log all socket events for debugging
    socket.onAny((event, data) => {
      console.log('📡 User Socket event:', event, data);
    });
    
    socket.on("device_registered", ({ device_id, pin }) => {
      console.log(`✅ Device registered with PIN: ${pin}`);
      setPin(pin);
    });

    socket.on("error", (message) => {
      console.error('❌ Socket error:', message);
      setError(message);
      alert(`Error: ${message}`);
    });

    return () => {
      socket.offAny();
      socket.off("device_registered");
      socket.off("error");
      stopSharing();
    };
  }, []);

  // Start screen capture when streaming starts
  useEffect(() => {
    if (streaming && pin) {
      console.log('🚀 Starting screen capture for device:', deviceId);
      startScreenCapture();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [streaming, pin, deviceId]);

  const startScreenCapture = async () => {
    try {
      console.log('🎥 Requesting screen share permission...');
      
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          cursor: "always",
          frameRate: 10
        },
        audio: false
      });
      
      mediaStreamRef.current = mediaStream;
      
      // Setup video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        console.log('✅ Video element ready');
      }
      
      // Start capturing frames after video is ready
      videoRef.current.onloadedmetadata = () => {
        console.log('📹 Video metadata loaded, starting frame capture');
        captureFrame();
      };
      
      // Handle when the user stops sharing
      mediaStream.getTracks().forEach(track => {
        track.onended = () => {
          console.log('🛑 Screen sharing ended by user');
          stopSharing();
        };
      });
      
    } catch (err) {
      console.error("Screen capture error:", err);
      setError("Failed to capture screen: " + err.message);
      stopSharing();
    }
  };

  const captureFrame = () => {
    if (!streaming || !videoRef.current || !canvasRef.current) {
      console.log('⏸️ Frame capture paused - not streaming');
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Check if video is ready
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.log('⏳ Video not ready yet, retrying...');
      animationRef.current = requestAnimationFrame(captureFrame);
      return;
    }
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to JPEG with quality 0.7 for better performance
    const imageData = canvas.toDataURL("image/jpeg", 0.7);
    
    // Send screen data to server
    console.log('📤 Sending screen data to device:', deviceId);
    socket.emit("screen-data", { 
      device_id: deviceId, 
      image: imageData 
    });
    
    // Throttle to 5 FPS (200ms interval)
    setTimeout(() => {
      animationRef.current = requestAnimationFrame(captureFrame);
    }, 200);
  };

  const handleStartSharing = async () => {
    if (!deviceId) {
      setError("Device ID is required");
      return;
    }
    if (!deviceName) {
      setError("Device Name is required");
      return;
    }
    
    setError("");
    
    try {
      console.log('📋 Registering device:', deviceId);
      
      // Register the device with the server
      socket.emit("register_device", { 
        device_id: deviceId, 
        name: deviceName
      });
      
      setStreaming(true);
      console.log('⏳ Waiting for PIN and starting screen share...');
      
    } catch (err) {
      console.error("Registration error:", err);
      setError("Error registering device: " + err.message);
    }
  };

  const stopSharing = () => {
    console.log('🛑 Stopping screen sharing');
    
    // Stop animation frame
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Clear video element
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
    
    setStreaming(false);
    setPin("");
  };

  const handleTestFrame = () => {
    // Send a test frame for debugging
    const testImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZvbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UZXN0IFNjcmVlbiBGcmFtZTwvdGV4dD48L3N2Zz4=';
    
    socket.emit("screen-data", { 
      device_id: deviceId, 
      image: testImage 
    });
    
    console.log('🧪 Sent test screen frame');
  };

  const copyPinToClipboard = () => {
    navigator.clipboard.writeText(pin).then(() => {
      alert('PIN copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy PIN:', err);
    });
  };

  return (
    <div className="user-dashboard">
      <h2>User Dashboard - Screen Sharing</h2>
      
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}
      
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Enter Device ID" 
          value={deviceId} 
          onChange={(e) => setDeviceId(e.target.value)} 
          disabled={streaming}
        />
        <input 
          type="text" 
          placeholder="Enter Device Name" 
          value={deviceName} 
          onChange={(e) => setDeviceName(e.target.value)} 
          disabled={streaming}
        />
      </div>
      
      <div className="button-group">
        <button 
          onClick={streaming ? stopSharing : handleStartSharing}
          className={streaming ? "stop-button" : "start-button"}
        >
          {streaming ? "Stop Sharing" : "Start Sharing"}
        </button>
        
        {streaming && (
          <button 
            onClick={handleTestFrame}
            className="test-button"
          >
            Test Frame
          </button>
        )}
      </div>
      
      {/* Hidden elements for screen capture */}
      <video 
        ref={videoRef} 
        style={{display: 'none'}} 
        autoPlay 
        muted 
        playsInline
      />
      <canvas 
        ref={canvasRef} 
        style={{display: 'none'}} 
      />
      
      {streaming && pin && (
        <div className="device-info">
          <div className="pin-info">
            <h3>🔑 Your Sharing PIN</h3>
            <div className="pin-display">
              <span className="pin-value">{pin}</span>
              <button 
                onClick={copyPinToClipboard}
                className="copy-button"
                title="Copy PIN to clipboard"
              >
                📋 Copy
              </button>
            </div>
            <p className="pin-instructions">
              Share this PIN with viewers to allow them to connect to your screen.
            </p>
          </div>
          
          <div className="status-info">
            <p>📡 Status: <span className="status-online">Live Streaming</span></p>
            <p>🖥️ Device: {deviceName} ({deviceId})</p>
          </div>
        </div>
      )}
      
      {streaming && !pin && (
        <div className="loading-info">
          <p>⏳ Waiting for PIN assignment...</p>
        </div>
      )}
      
      <div className="debug-info">
        <p><small>Open browser console (F12) for detailed logs</small></p>
      </div>
    </div>
  );
};

export default UserDashboard;