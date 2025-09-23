

// import { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000");

// export default function Viewer() {
//   const [pin, setPin] = useState("");
//   const [accessKey, setAccessKey] = useState("");
//   const [deviceId, setDeviceId] = useState("");
//   const [connected, setConnected] = useState(false);
//   const [error, setError] = useState("");
//   const [usePin, setUsePin] = useState(true);
//   const [status, setStatus] = useState("Disconnected");
//   const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
//   const [lastImageTime, setLastImageTime] = useState(null);
//   const [scaleFactor, setScaleFactor] = useState(1);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     // Set up socket listeners
//     socket.on("connect", () => {
//       console.log("✅ Connected to server");
//       setStatus("Connected to server");
//     });

//     socket.on("disconnect", () => {
//       console.log("❌ Disconnected from server");
//       setStatus("Disconnected");
//       setConnected(false);
//     });

//     socket.on("join_success", ({ device_id }) => {
//       console.log("✅ Joined device successfully:", device_id);
//       setConnected(true);
//       setDeviceId(device_id);
//       setError("");
//       setStatus(`Connected to device: ${device_id}`);
//     });

//     socket.on("join_error", ({ message }) => {
//       console.error("❌ Join error:", message);
//       setError(message);
//       setStatus(`Error: ${message}`);
//     });

//     // Screen data handler
//     socket.on("screen-data", (data) => {
//       console.log('📺 Received screen data:', data);
//       setLastImageTime(new Date());
      
//       if (!data || !data.image) {
//         console.error('❌ Invalid screen data received');
//         setStatus('Error: Invalid screen data');
//         return;
//       }

//       if (data.device_id !== deviceId) {
//         console.log('⚠️ Ignoring screen data for different device:', data.device_id);
//         return;
//       }

//       setStatus("Receiving screen stream...");
      
//       // Create image element
//       const img = new Image();
      
//       img.onload = function() {
//         console.log('✅ Image loaded successfully - dimensions:', img.width, 'x', img.height);
//         if (canvasRef.current) {
//           const ctx = canvasRef.current.getContext("2d");
          
//           // Set internal pixel dimensions to match image
//           canvasRef.current.width = img.width;
//           canvasRef.current.height = img.height;
//           setCanvasSize({ width: img.width, height: img.height });
          
//           // Clear and draw the image
//           ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//           ctx.drawImage(img, 0, 0, img.width, img.height);
          
//           setStatus(`✅ Streaming: ${deviceId} (${img.width}x${img.height})`);
          
//           // Auto-scale canvas after image loads
//           setTimeout(scaleCanvasToFit, 100);
//         }
//       };
      
//       img.onerror = function() {
//         console.error('❌ Failed to load image');
//         setStatus("Error loading image");
//       };
      
//       img.src = data.image;
//     });

//     socket.on("error", (message) => {
//       console.error("❌ Socket error:", message);
//       setError(message);
//       setStatus(`Error: ${message}`);
//     });

//     return () => {
//       // Clean up event listeners
//       socket.off("connect");
//       socket.off("disconnect");
//       socket.off("join_success");
//       socket.off("join_error");
//       socket.off("screen-data");
//       socket.off("error");
//     };
//   }, [deviceId]);

//   // Auto-scale canvas to fit container
//   useEffect(() => {
//     const scaleCanvasToFit = () => {
//       if (canvasRef.current && canvasSize.width > 0) {
//         const container = canvasRef.current.parentElement;
//         const maxWidth = container.clientWidth - 40; // Account for padding and border
//         const scale = Math.min(1, maxWidth / canvasSize.width);
        
//         setScaleFactor(scale);
        
//         canvasRef.current.style.width = `${canvasSize.width * scale}px`;
//         canvasRef.current.style.height = `${canvasSize.height * scale}px`;
        
//         console.log(`🔄 Scaled canvas: ${canvasSize.width}x${canvasSize.height} -> ${Math.round(canvasSize.width * scale)}x${Math.round(canvasSize.height * scale)} (scale: ${scale.toFixed(2)})`);
//       }
//     };

//     scaleCanvasToFit();
    
//     // Add resize listener
//     window.addEventListener('resize', scaleCanvasToFit);
    
//     return () => {
//       window.removeEventListener('resize', scaleCanvasToFit);
//     };
//   }, [canvasSize]);

//   const scaleCanvasToFit = () => {
//     if (canvasRef.current && canvasSize.width > 0) {
//       const container = canvasRef.current.parentElement;
//       const maxWidth = container.clientWidth - 40;
//       const scale = Math.min(1, maxWidth / canvasSize.width);
      
//       setScaleFactor(scale);
      
//       canvasRef.current.style.width = `${canvasSize.width * scale}px`;
//       canvasRef.current.style.height = `${canvasSize.height * scale}px`;
//     }
//   };

//   const handleJoin = () => {
//     setError("");
//     setStatus("Connecting...");
    
//     if (usePin) {
//       if (!pin) {
//         setError("PIN is required");
//         setStatus("PIN is required");
//         return;
//       }
//       console.log("🔗 Joining with PIN:", pin);
//       socket.emit("join_with_pin", { pin });
//     } else {
//       if (!deviceId || !accessKey) {
//         setError("Device ID and Access Key are required");
//         setStatus("Device ID and Access Key are required");
//         return;
//       }
//       console.log("🔗 Joining with device ID:", deviceId);
//       socket.emit("watch-device", { device_id: deviceId, access_key: accessKey });
//     }
//   };

//   const handleDisconnect = () => {
//     socket.disconnect();
//     setConnected(false);
//     setStatus("Disconnected");
//     setError("");
//     setCanvasSize({ width: 0, height: 0 });
//   };

//   const testCanvasDrawing = () => {
//     if (canvasRef.current) {
//       const ctx = canvasRef.current.getContext("2d");
//       const width = 400;
//       const height = 300;
      
//       canvasRef.current.width = width;
//       canvasRef.current.height = height;
//       setCanvasSize({ width, height });
      
//       // Draw test pattern
//       ctx.clearRect(0, 0, width, height);
      
//       // Gradient background
//       const gradient = ctx.createLinearGradient(0, 0, width, height);
//       gradient.addColorStop(0, '#ff6b6b');
//       gradient.addColorStop(1, '#4ecdc4');
//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, 0, width, height);
      
//       // Text
//       ctx.fillStyle = 'white';
//       ctx.font = 'bold 24px Arial';
//       ctx.textAlign = 'center';
//       ctx.fillText('Canvas Works!', width / 2, height / 2);
      
//       ctx.font = '16px Arial';
//       ctx.fillText('Click to test drawing', width / 2, height / 2 + 30);
      
//       // Border
//       ctx.strokeStyle = '#2d3436';
//       ctx.lineWidth = 4;
//       ctx.strokeRect(10, 10, width - 20, height - 20);
      
//       setStatus("✅ Test pattern drawn successfully");
      
//       // Scale to fit
//       setTimeout(scaleCanvasToFit, 100);
//     }
//   };

//   const handleCanvasClick = (e) => {
//     if (canvasRef.current) {
//       const rect = canvasRef.current.getBoundingClientRect();
//       const scaleX = canvasRef.current.width / rect.width;
//       const scaleY = canvasRef.current.height / rect.height;
//       const x = (e.clientX - rect.left) * scaleX;
//       const y = (e.clientY - rect.top) * scaleY;
      
//       const ctx = canvasRef.current.getContext("2d");
//       ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
//       ctx.beginPath();
//       ctx.arc(x, y, 15, 0, Math.PI * 2);
//       ctx.fill();
      
//       console.log(`Canvas clicked at: ${Math.round(x)}, ${Math.round(y)} (scaled coordinates)`);
//     }
//   };

//   const handleFullScreen = () => {
//     if (canvasRef.current) {
//       if (canvasRef.current.requestFullscreen) {
//         canvasRef.current.requestFullscreen();
//       } else if (canvasRef.current.webkitRequestFullscreen) {
//         canvasRef.current.webkitRequestFullscreen();
//       } else if (canvasRef.current.msRequestFullscreen) {
//         canvasRef.current.msRequestFullscreen();
//       }
//     }
//   };

//   return (
//     <div className="viewer-dashboard" style={{ 
//       padding: '20px', 
//       fontFamily: 'Arial, sans-serif', 
//       position: 'relative',
//       maxWidth: '1400px',
//       margin: '0 auto',
//       minHeight: '100vh'
//     }}>
//       <h2 style={{ color: '#2d3436', marginBottom: '20px', textAlign: 'center' }}>🎥 Screen Viewer Dashboard</h2>
      
//       {/* Debug Overlay */}
//       <div style={{
//         position: 'fixed',
//         top: '10px',
//         right: '10px',
//         background: 'rgba(0,0,0,0.9)',
//         color: 'white',
//         padding: '15px',
//         borderRadius: '8px',
//         fontSize: '12px',
//         zIndex: 1000,
//         maxWidth: '300px',
//         border: '2px solid #00b894',
//         backdropFilter: 'blur(5px)'
//       }}>
//         <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#00b894' }}>🖥️ LIVE DEBUG</div>
//         <div>📏 Source: {canvasSize.width}x{canvasSize.height}</div>
//         <div>📐 Display: {canvasSize.width > 0 ? `${Math.round(canvasSize.width * scaleFactor)}x${Math.round(canvasSize.height * scaleFactor)}` : 'N/A'}</div>
//         <div>🔌 Socket: {socket.id ? '✅ Connected' : '❌ Disconnected'}</div>
//         <div>📱 Device: {deviceId}</div>
//         <div>🔄 Status: {status}</div>
//         {lastImageTime && (
//           <div>⏰ Last Frame: {Math.round((new Date() - lastImageTime) / 1000)}s ago</div>
//         )}
//       </div>
      
//       <div className="status" style={{ 
//         padding: '15px', 
//         margin: '15px 0', 
//         backgroundColor: connected ? '#d5f5e3' : '#fdebd0',
//         border: `2px solid ${connected ? '#27ae60' : '#f39c12'}`,
//         borderRadius: '8px',
//         fontWeight: 'bold',
//         textAlign: 'center'
//       }}>
//         {connected ? '🚀' : '⏸️'} <strong>Status:</strong> {status}
//       </div>
      
//       {error && (
//         <div className="error-message" style={{ 
//           color: '#c23616', 
//           padding: '15px', 
//           margin: '15px 0',
//           backgroundColor: '#ffebee',
//           border: '2px solid #e84118',
//           borderRadius: '8px',
//           fontWeight: 'bold',
//           textAlign: 'center'
//         }}>
//           ❌ {error}
//         </div>
//       )}
      
//       <div className="connection-type" style={{ 
//         margin: '20px 0', 
//         padding: '20px', 
//         backgroundColor: '#f8f9fa', 
//         borderRadius: '10px',
//         textAlign: 'center'
//       }}>
//         <label style={{ marginRight: '20px', fontWeight: 'bold', fontSize: '16px' }}>
//           <input
//             type="radio"
//             checked={usePin}
//             onChange={() => setUsePin(true)}
//             disabled={connected}
//             style={{ marginRight: '8px' }}
//           />
//           🔑 Connect with PIN
//         </label>
//         <label style={{ fontWeight: 'bold', fontSize: '16px' }}>
//           <input
//             type="radio"
//             checked={!usePin}
//             onChange={() => setUsePin(false)}
//             disabled={connected}
//             style={{ marginRight: '8px' }}
//           />
//           📱 Connect with Device ID
//         </label>
//       </div>
      
//       {!connected ? (
//         <div className="connection-form" style={{ 
//           padding: '25px', 
//           backgroundColor: '#f8f9fa', 
//           borderRadius: '10px',
//           textAlign: 'center',
//           maxWidth: '500px',
//           margin: '0 auto'
//         }}>
//           {usePin ? (
//             <div style={{ margin: '20px 0' }}>
//               <input
//                 type="text"
//                 placeholder="Enter 6-digit PIN"
//                 value={pin}
//                 onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                 style={{ 
//                   padding: '14px', 
//                   borderRadius: '8px', 
//                   border: '2px solid #bdc3c7',
//                   width: '200px',
//                   fontSize: '18px',
//                   textAlign: 'center',
//                   fontWeight: 'bold'
//                 }}
//               />
//             </div>
//           ) : (
//             <div style={{ margin: '20px 0' }}>
//               <input
//                 type="text"
//                 placeholder="Enter Device ID"
//                 value={deviceId}
//                 onChange={(e) => setDeviceId(e.target.value)}
//                 style={{ 
//                   padding: '14px', 
//                   borderRadius: '8px', 
//                   border: '2px solid #bdc3c7',
//                   display: 'block', 
//                   margin: '10px auto', 
//                   width: '250px',
//                   fontSize: '16px'
//                 }}
//               />
//               <input
//                 type="password"
//                 placeholder="Enter Access Key"
//                 value={accessKey}
//                 onChange={(e) => setAccessKey(e.target.value)}
//                 style={{ 
//                   padding: '14px', 
//                   borderRadius: '8px', 
//                   border: '2px solid #bdc3c7',
//                   display: 'block', 
//                   margin: '10px auto', 
//                   width: '250px',
//                   fontSize: '16px'
//                 }}
//               />
//             </div>
//           )}
          
//           <button 
//             onClick={handleJoin} 
//             style={{ 
//               padding: '14px 28px', 
//               backgroundColor: '#0984e3', 
//               color: 'white', 
//               border: 'none', 
//               borderRadius: '8px', 
//               cursor: 'pointer',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               marginTop: '15px'
//             }}
//           >
//             🚀 Connect to Stream
//           </button>
//         </div>
//       ) : (
//         <div>
//           <div style={{ 
//             margin: '25px 0', 
//             display: 'flex', 
//             gap: '12px', 
//             flexWrap: 'wrap',
//             justifyContent: 'center'
//           }}>
//             <button 
//               onClick={handleDisconnect}
//               style={{ 
//                 padding: '12px 24px', 
//                 backgroundColor: '#e74c3c', 
//                 color: 'white', 
//                 border: 'none', 
//                 borderRadius: '8px', 
//                 cursor: 'pointer',
//                 fontWeight: 'bold',
//                 fontSize: '16px'
//               }}
//             >
//               🔌 Disconnect
//             </button>
//             <button 
//               onClick={testCanvasDrawing}
//               style={{ 
//                 padding: '12px 24px', 
//                 backgroundColor: '#f39c12', 
//                 color: 'white', 
//                 border: 'none', 
//                 borderRadius: '8px', 
//                 cursor: 'pointer',
//                 fontWeight: 'bold',
//                 fontSize: '16px'
//               }}
//             >
//               🎨 Test Canvas
//             </button>
//             <button 
//               onClick={handleFullScreen}
//               style={{ 
//                 padding: '12px 24px', 
//                 backgroundColor: '#9b59b6', 
//                 color: 'white', 
//                 border: 'none', 
//                 borderRadius: '8px', 
//                 cursor: 'pointer',
//                 fontWeight: 'bold',
//                 fontSize: '16px'
//               }}
//             >
//               📺 Fullscreen
//             </button>
//             <button 
//               onClick={scaleCanvasToFit}
//               style={{ 
//                 padding: '12px 24px', 
//                 backgroundColor: '#27ae60', 
//                 color: 'white', 
//                 border: 'none', 
//                 borderRadius: '8px', 
//                 cursor: 'pointer',
//                 fontWeight: 'bold',
//                 fontSize: '16px'
//               }}
//             >
//               🔄 Rescale
//             </button>
//           </div>
          
//           <div style={{ margin: '30px 0', textAlign: 'center' }}>
//             <h3 style={{ color: '#2d3436', marginBottom: '20px', fontSize: '24px' }}>
//               📺 Live Stream from: <span style={{ color: '#0984e3' }}>{deviceId}</span>
//             </h3>
            
//             {/* Canvas Container */}
//             <div style={{ 
//               border: '4px solid #00cec9', 
//               padding: '20px', 
//               display: 'inline-block',
//               backgroundColor: '#2d3436',
//               borderRadius: '12px',
//               margin: '20px 0',
//               boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
//               maxWidth: '95%',
//               overflow: 'hidden'
//             }}>
//               <canvas 
//                 ref={canvasRef} 
//                 onClick={handleCanvasClick}
//                 style={{ 
//                   display: 'block',
//                   border: '2px solid #636e72', 
//                   backgroundColor: '#000',
//                   cursor: 'pointer',
//                   borderRadius: '6px',
//                   margin: '0 auto',
//                   maxWidth: '100%',
//                   height: 'auto'
//                 }}
//               />
//             </div>
            
//             <div style={{ 
//               marginTop: '20px', 
//               padding: '20px', 
//               backgroundColor: '#dfe6e9', 
//               borderRadius: '10px',
//               fontSize: '16px',
//               color: '#2d3436',
//               maxWidth: '600px',
//               margin: '20px auto'
//             }}>
//               <p><strong>🎯 Stream Information:</strong></p>
//               <p>• <strong>Resolution:</strong> {canvasSize.width} x {canvasSize.height} pixels</p>
//               <p>• <strong>Scale:</strong> {scaleFactor.toFixed(2)}x ({Math.round(canvasSize.width * scaleFactor)}x{Math.round(canvasSize.height * scaleFactor)})</p>
//               <p>• <strong>💡 Tips:</strong> </p>
//               <p>  - Click "Test Canvas" to verify drawing works</p>
//               <p>  - Click on the stream to draw circles</p>
//               <p>  - Use "Fullscreen" for better viewing</p>
//               {lastImageTime && (
//                 <p>• <strong>⏱️ Active:</strong> {Math.round((new Date() - lastImageTime) / 1000)} seconds ago</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
      
//       <div style={{ 
//         marginTop: '40px', 
//         padding: '25px', 
//         backgroundColor: '#f8f9fa', 
//         borderRadius: '12px',
//         border: '2px solid #bdc3c7',
//         textAlign: 'center'
//       }}>
//         <h4 style={{ color: '#2d3436', marginBottom: '20px', fontSize: '20px' }}>📊 System Information</h4>
//         <div style={{ 
//           display: 'grid', 
//           gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
//           gap: '15px',
//           textAlign: 'left',
//           maxWidth: '800px',
//           margin: '0 auto'
//         }}>
//           <div>
//             <p><strong>🔌 Socket ID:</strong> {socket.id || 'Not connected'}</p>
//             <p><strong>📱 Device ID:</strong> {deviceId || 'Not connected'}</p>
//           </div>
//           <div>
//             <p><strong>📶 Connection:</strong> {connected ? '✅ Connected' : '❌ Disconnected'}</p>
//             <p><strong>🖥️ Canvas Ready:</strong> {canvasSize.width > 0 ? '✅ Yes' : '❌ No'}</p>
//           </div>
//         </div>
//         <p style={{ marginTop: '15px', fontWeight: 'bold' }}>
//           🔍 Open browser console (F12) for detailed technical information
//         </p>
//       </div>
//     </div>
//   );
// }





import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./deviceViewer.css";

const socket = io("http://localhost:5000");

const DeviceViewer = () => {
  const [deviceId, setDeviceId] = useState("");
  const [pin, setPin] = useState("");
  const [streaming, setStreaming] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [error, setError] = useState("");

  // Log all socket events
  useEffect(() => {
    socket.onAny((event, data) => {
      console.log("📡 Socket event:", event, data);
    });

    socket.on("device_registered", ({ pin }) => {
      setPin(pin);
    });

    socket.on("error", (message) => {
      setError(message);
      alert(`Error: ${message}`);
    });

    return () => {
      socket.offAny();
      socket.off("device_registered");
      socket.off("error");
      stopStreaming();
    };
  }, []);

  const startStreaming = async () => {
    if (!deviceId) {
      setError("Device ID is required");
      return;
    }

    setStreaming(true);

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

      videoRef.current.onloadedmetadata = () => {
        captureFrame();
      };

      mediaStream.getTracks().forEach((track) => {
        track.onended = () => stopStreaming();
      });
    } catch (err) {
      setError("Failed to capture screen: " + err.message);
      stopStreaming();
    }
  };

  const captureFrame = () => {
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
  };

  const stopStreaming = () => {
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
    <div className="device-viewer">
      <h2>Device Viewer</h2>

      {error && <div className="error-message">❌ {error}</div>}

      <input
        type="text"
        placeholder="Enter Device ID"
        value={deviceId}
        onChange={(e) => setDeviceId(e.target.value)}
        disabled={streaming}
      />

      <button onClick={streaming ? stopStreaming : startStreaming}>
        {streaming ? "Stop Streaming" : "Start Streaming"}
      </button>

      <video ref={videoRef} style={{ display: "none" }} autoPlay muted />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {streaming && pin && (
        <div className="pin-info">
          <p>🔑 Your PIN: {pin}</p>
        </div>
      )}
    </div>
  );
};

export default DeviceViewer;
