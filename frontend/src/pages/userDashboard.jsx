






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
//   const mediaStreamRef = useRef(null);

//   useEffect(() => {
//     // Log all socket events for debugging
//     socket.onAny((event, data) => {
//       console.log('📡 User Socket event:', event, data);
//     });
    
//     socket.on("device_registered", ({ device_id, pin }) => {
//       console.log(`✅ Device registered with PIN: ${pin}`);
//       setPin(pin);
//     });

//     socket.on("error", (message) => {
//       console.error('❌ Socket error:', message);
//       setError(message);
//       alert(`Error: ${message}`);
//     });

//     return () => {
//       socket.offAny();
//       socket.off("device_registered");
//       socket.off("error");
//       stopSharing();
//     };
//   }, []);

//   // Start screen capture when streaming starts
//   useEffect(() => {
//     if (streaming && pin) {
//       console.log('🚀 Starting screen capture for device:', deviceId);
//       startScreenCapture();
//     }
    
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [streaming, pin, deviceId]);

//   const startScreenCapture = async () => {
//     try {
//       console.log('🎥 Requesting screen share permission...');
      
//       const mediaStream = await navigator.mediaDevices.getDisplayMedia({
//         video: { 
//           cursor: "always",
//           frameRate: 10
//         },
//         audio: false
//       });
      
//       mediaStreamRef.current = mediaStream;
      
//       // Setup video element
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//         await videoRef.current.play();
//         console.log('✅ Video element ready');
//       }
      
//       // Start capturing frames after video is ready
//       videoRef.current.onloadedmetadata = () => {
//         console.log('📹 Video metadata loaded, starting frame capture');
//         captureFrame();
//       };
      
//       // Handle when the user stops sharing
//       mediaStream.getTracks().forEach(track => {
//         track.onended = () => {
//           console.log('🛑 Screen sharing ended by user');
//           stopSharing();
//         };
//       });
      
//     } catch (err) {
//       console.error("Screen capture error:", err);
//       setError("Failed to capture screen: " + err.message);
//       stopSharing();
//     }
//   };

//   const captureFrame = () => {
//     if (!streaming || !videoRef.current || !canvasRef.current) {
//       console.log('⏸️ Frame capture paused - not streaming');
//       return;
//     }
    
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
    
//     // Check if video is ready
//     if (video.videoWidth === 0 || video.videoHeight === 0) {
//       console.log('⏳ Video not ready yet, retrying...');
//       animationRef.current = requestAnimationFrame(captureFrame);
//       return;
//     }
    
//     // Set canvas size to match video
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
    
//     // Draw current video frame to canvas
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
//     // Convert to JPEG with quality 0.7 for better performance
//     const imageData = canvas.toDataURL("image/jpeg", 0.7);
    
//     // Send screen data to server
//     console.log('📤 Sending screen data to device:', deviceId);
//     socket.emit("screen-data", { 
//       device_id: deviceId, 
//       image: imageData 
//     });
    
//     // Throttle to 5 FPS (200ms interval)
//     setTimeout(() => {
//       animationRef.current = requestAnimationFrame(captureFrame);
//     }, 200);
//   };

//   const handleStartSharing = async () => {
//     if (!deviceId) {
//       setError("Device ID is required");
//       return;
//     }
//     if (!deviceName) {
//       setError("Device Name is required");
//       return;
//     }
    
//     setError("");
    
//     try {
//       console.log('📋 Registering device:', deviceId);
      
//       // Register the device with the server
//       socket.emit("register_device", { 
//         device_id: deviceId, 
//         name: deviceName
//       });
      
//       setStreaming(true);
//       console.log('⏳ Waiting for PIN and starting screen share...');
      
//     } catch (err) {
//       console.error("Registration error:", err);
//       setError("Error registering device: " + err.message);
//     }
//   };

//   const stopSharing = () => {
//     console.log('🛑 Stopping screen sharing');
    
//     // Stop animation frame
//     if (animationRef.current) {
//       cancelAnimationFrame(animationRef.current);
//       animationRef.current = null;
//     }
    
//     // Stop media stream
//     if (mediaStreamRef.current) {
//       mediaStreamRef.current.getTracks().forEach(track => track.stop());
//       mediaStreamRef.current = null;
//     }
    
//     // Clear video element
//     if (videoRef.current && videoRef.current.srcObject) {
//       videoRef.current.srcObject = null;
//     }
    
//     setStreaming(false);
//     setPin("");
//   };

//   const handleTestFrame = () => {
//     // Send a test frame for debugging
//     const testImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZvbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UZXN0IFNjcmVlbiBGcmFtZTwvdGV4dD48L3N2Zz4=';
    
//     socket.emit("screen-data", { 
//       device_id: deviceId, 
//       image: testImage 
//     });
    
//     console.log('🧪 Sent test screen frame');
//   };

//   const copyPinToClipboard = () => {
//     navigator.clipboard.writeText(pin).then(() => {
//       alert('PIN copied to clipboard!');
//     }).catch(err => {
//       console.error('Failed to copy PIN:', err);
//     });
//   };

//   return (
//     <div className="user-dashboard">
//       <h2>User Dashboard - Screen Sharing</h2>
      
//       {error && (
//         <div className="error-message">
//           ❌ {error}
//         </div>
//       )}
      
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
      
//       <div className="button-group">
//         <button 
//           onClick={streaming ? stopSharing : handleStartSharing}
//           className={streaming ? "stop-button" : "start-button"}
//         >
//           {streaming ? "Stop Sharing" : "Start Sharing"}
//         </button>
        
//         {streaming && (
//           <button 
//             onClick={handleTestFrame}
//             className="test-button"
//           >
//             Test Frame
//           </button>
//         )}
//       </div>
      
//       {/* Hidden elements for screen capture */}
//       <video 
//         ref={videoRef} 
//         style={{display: 'none'}} 
//         autoPlay 
//         muted 
//         playsInline
//       />
//       <canvas 
//         ref={canvasRef} 
//         style={{display: 'none'}} 
//       />
      
//       {streaming && pin && (
//         <div className="device-info">
//           <div className="pin-info">
//             <h3>🔑 Your Sharing PIN</h3>
//             <div className="pin-display">
//               <span className="pin-value">{pin}</span>
//               <button 
//                 onClick={copyPinToClipboard}
//                 className="copy-button"
//                 title="Copy PIN to clipboard"
//               >
//                 📋 Copy
//               </button>
//             </div>
//             <p className="pin-instructions">
//               Share this PIN with viewers to allow them to connect to your screen.
//             </p>
//           </div>
          
//           <div className="status-info">
//             <p>📡 Status: <span className="status-online">Live Streaming</span></p>
//             <p>🖥️ Device: {deviceName} ({deviceId})</p>
//           </div>
//         </div>
//       )}
      
//       {streaming && !pin && (
//         <div className="loading-info">
//           <p>⏳ Waiting for PIN assignment...</p>
//         </div>
//       )}
      
//       <div className="debug-info">
//         <p><small>Open browser console (F12) for detailed logs</small></p>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;




import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import "./userDashboard.css";

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
    socket.onAny((event, data) => console.log("📡 Socket:", event, data));

    socket.on("device_registered", ({ pin }) => setPin(pin));

    socket.on("error", (message) => {
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

  const captureFrame = useCallback(() => {
    if (!streaming || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg", 0.7);
    socket.emit("screen-data", { device_id: deviceId, image: imageData });

    setTimeout(() => {
      animationRef.current = requestAnimationFrame(captureFrame);
    }, 200);
  }, [streaming, deviceId]);

  const startScreenCapture = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always", frameRate: 10 },
        audio: false,
      });

      mediaStreamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      videoRef.current.onloadedmetadata = captureFrame;

      mediaStream.getTracks().forEach((track) => {
        track.onended = stopSharing;
      });
    } catch (err) {
      setError("Screen capture failed: " + err.message);
      stopSharing();
    }
  };

  const handleStartSharing = () => {
    if (!deviceId || !deviceName) {
      setError("Device ID and Name are required");
      return;
    }

    setStreaming(true);
    socket.emit("register_device", { device_id: deviceId, name: deviceName });
  };

  const stopSharing = () => {
    setStreaming(false);
    setPin("");

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (videoRef.current) videoRef.current.srcObject = null;
  };

  return (
    <div className="user-dashboard">
      <h2>User Dashboard - Screen Sharing</h2>

      {error && <div className="error-message">❌ {error}</div>}

      <input
        type="text"
        placeholder="Device ID"
        value={deviceId}
        onChange={(e) => setDeviceId(e.target.value)}
        disabled={streaming}
      />
      <input
        type="text"
        placeholder="Device Name"
        value={deviceName}
        onChange={(e) => setDeviceName(e.target.value)}
        disabled={streaming}
      />

      <button onClick={streaming ? stopSharing : handleStartSharing}>
        {streaming ? "Stop Sharing" : "Start Sharing"}
      </button>

      <video ref={videoRef} style={{ display: "none" }} autoPlay muted />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {streaming && pin && <p>🔑 PIN: {pin}</p>}
    </div>
  );
};

export default UserDashboard;
