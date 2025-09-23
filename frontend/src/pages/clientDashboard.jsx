


import React, { useEffect, useState, useCallback } from "react";
import "./clientDashboard.css";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ClientDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [userMessage, setUserMessage] = useState("");

  // Fetch devices function
  const fetchDevices = useCallback(() => {
    setLoading(true);
    console.log("Requesting devices from server...");
    socket.emit("devices:get");
  }, []);

  useEffect(() => {
    // Set up socket listeners
    socket.on("devices:update", (deviceList) => {
      console.log("Received devices:", deviceList);
      setDevices(deviceList);
      setLoading(false);
      setError("");
    });

    socket.on("error", (message) => {
      console.error("Socket error:", message);
      setError(message);
      setLoading(false);
    });

    // Request devices when component mounts
    fetchDevices();

    // Clean up on unmount
    return () => {
      socket.off("devices:update");
      socket.off("error");
    };
  }, [fetchDevices]);

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/create-user", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userFormData, role: "user" }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");
      
      setUserMessage("✅ User created successfully!");
      setUserFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setUserMessage("❌ " + err.message);
    }
  };

  const handleRefreshDevices = () => {
    console.log("Refreshing devices...");
    fetchDevices();
  };

  // Fixed handleViewDevice function
// Update the handleViewDevice function in ClientDashboard.jsx
const handleViewDevice = (deviceId, devicePin = null) => {
  const viewerWindow = window.open("", "_blank", "width=1000,height=700");
  if (!viewerWindow) return;
  
  viewerWindow.document.write(`
    <html>
      <head>
        <title>Viewing Device: ${deviceId}</title>
        <script src="/socket.io/socket.io.js"></script>
        <style>
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: Arial, sans-serif; 
            background: #f5f5f5;
          }
          #status { 
            margin-bottom: 10px; 
            padding: 15px; 
            background: #e8f5e8; 
            border: 1px solid #4caf50;
            border-radius: 5px;
            color: #2e7d32;
          }
          #viewerCanvas { 
            width: 100%; 
            height: 80vh; 
            border: 2px solid #ccc; 
            background: #000;
            display: block;
            margin: 0 auto;
          }
          .error { 
            background: #ffebee; 
            border: 1px solid #f44336;
            color: #c62828;
          }
          .loading { 
            background: #fff3e0; 
            border: 1px solid #ff9800;
            color: #e65100;
          }
        </style>
      </head>
      <body>
        <h2>Viewing Device: ${deviceId}</h2>
        <div id="status">🔄 Connecting to server...</div>
        <canvas id="viewerCanvas"></canvas>
        
        <script>
          console.log('Viewer window initialized for device: ${deviceId}');
          const socket = io("http://localhost:5000");
          const canvas = document.getElementById("viewerCanvas");
          const ctx = canvas.getContext("2d");
          const statusDiv = document.getElementById("status");
          
          // Set initial canvas size
          canvas.width = 800;
          canvas.height = 600;
          ctx.fillStyle = '#333';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'white';
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Waiting for screen data...', canvas.width / 2, canvas.height / 2);
          
          // Connection events
          socket.on("connect", () => {
            statusDiv.innerHTML = "✅ Connected to server - Waiting for device...";
            statusDiv.className = '';
            
            ${devicePin ? 
              `console.log('Joining with PIN:', "${devicePin}");
               socket.emit("join_with_pin", { pin: "${devicePin}" });` : 
              `const accessKey = prompt("Enter Access Key for device ${deviceId}:");
               if (!accessKey) {
                 statusDiv.innerHTML = "❌ Access Key is required";
                 statusDiv.className = 'error';
                 return;
               }
               console.log('Joining with access key:', accessKey);
               socket.emit("watch-device", {
                 device_id: "${deviceId}",
                 access_key: accessKey
               });`
            }
          });
          
          socket.on("watching-started", (data) => {
            statusDiv.innerHTML = "✅ Connected to device - Waiting for screen data...";
            console.log('Watching started:', data);
          });
          
          // ✅ CRITICAL FIX: Listen for the correct event
          socket.on("screen-data", (data) => {
            console.log('Received screen data:', data);
            
            if (!data || !data.image) {
              console.error('No image data received');
              statusDiv.innerHTML = "❌ No image data received";
              statusDiv.className = 'error';
              return;
            }
            
            const img = new Image();
            img.onload = function() {
              console.log('Image loaded successfully');
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              statusDiv.innerHTML = "✅ Receiving screen stream...";
            };
            img.onerror = function() {
              console.error('Failed to load image');
              statusDiv.innerHTML = "❌ Error loading screen image";
              statusDiv.className = 'error';
            };
            img.src = data.image;
          });
          
          socket.on("error", (message) => {
            statusDiv.innerHTML = "❌ Error: " + message;
            statusDiv.className = 'error';
            console.error('Socket error:', message);
          });
          
          socket.on("disconnect", () => {
            statusDiv.innerHTML = "❌ Disconnected from server";
            statusDiv.className = 'error';
          });
          
          // Debug: Log all socket events
          socket.onAny((event, data) => {
            console.log('Socket event:', event, data);
          });
          
          // Handle window close
          window.onbeforeunload = () => {
            console.log('Closing viewer window');
            socket.disconnect();
          };
          
        </script>
      </body>
    </html>
  `);
  viewerWindow.document.close();
};



  // const handleViewDevice = (deviceId, devicePin = null) => {
  //   const viewerWindow = window.open("", "_blank", "width=1000,height=700");
  //   if (!viewerWindow) return;
    
  //   viewerWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>Viewing Device: ${deviceId}</title>
  //         <script src="/socket.io/socket.io.js"></script>
  //         <style>
  //           body { 
  //             margin: 0; 
  //             padding: 20px; 
  //             font-family: Arial, sans-serif; 
  //             background: #f5f5f5;
  //           }
  //           #status { 
  //             margin-bottom: 10px; 
  //             padding: 15px; 
  //             background: #e8f5e8; 
  //             border: 1px solid #4caf50;
  //             border-radius: 5px;
  //             color: #2e7d32;
  //           }
  //           #viewerCanvas { 
  //             width: 100%; 
  //             height: 80vh; 
  //             border: 2px solid #ccc; 
  //             background: #000;
  //             display: block;
  //             margin: 0 auto;
  //           }
  //           .error { 
  //             background: #ffebee; 
  //             border: 1px solid #f44336;
  //             color: #c62828;
  //           }
  //           .loading { 
  //             background: #fff3e0; 
  //             border: 1px solid #ff9800;
  //             color: #e65100;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <h2>Viewing Device: ${deviceId}</h2>
  //         <div id="status">🔄 Connecting to server...</div>
  //         <canvas id="viewerCanvas"></canvas>
          
  //         <script>
  //           console.log('Viewer window initialized for device: ${deviceId}');
  //           const socket = io("http://localhost:5000");
  //           const canvas = document.getElementById("viewerCanvas");
  //           const ctx = canvas.getContext("2d");
  //           const statusDiv = document.getElementById("status");
  //           const targetDeviceId = "${deviceId}"; // Store deviceId in a variable
            
  //           // Set initial canvas size
  //           canvas.width = 800;
  //           canvas.height = 600;
  //           ctx.fillStyle = '#333';
  //           ctx.fillRect(0, 0, canvas.width, canvas.height);
  //           ctx.fillStyle = 'white';
  //           ctx.font = '16px Arial';
  //           ctx.textAlign = 'center';
  //           ctx.fillText('Waiting for screen data...', canvas.width / 2, canvas.height / 2);
            
  //           // Connection events
  //           socket.on("connect", () => {
  //             statusDiv.innerHTML = "✅ Connected to server - Waiting for device...";
  //             statusDiv.className = '';
              
  //             ${devicePin ? 
  //               `console.log('Joining with PIN:', "${devicePin}");
  //                socket.emit("join_with_pin", { pin: "${devicePin}" });` : 
  //               `const accessKey = prompt("Enter Access Key for device ${deviceId}:");
  //                if (!accessKey) {
  //                  statusDiv.innerHTML = "❌ Access Key is required";
  //                  statusDiv.className = 'error';
  //                  return;
  //                }
  //                console.log('Joining with access key:', accessKey);
  //                socket.emit("watch-device", {
  //                  device_id: "${deviceId}",
  //                  access_key: accessKey
  //                });`
  //             }
  //           });
            
  //           socket.on("watching-started", (data) => {
  //             statusDiv.innerHTML = "✅ Connected to device - Waiting for screen data...";
  //             console.log('Watching started:', data);
  //           });
            
  //           // ✅ FIXED: Listen for screen-data events
  //           socket.on("screen-data", (data) => {
  //             console.log('Received screen-data event:', data);
              
  //             // Check if this is for our device
  //             if (data.device_id !== targetDeviceId) {
  //               console.log('Ignoring screen data for different device:', data.device_id);
  //               return;
  //             }
              
  //             statusDiv.innerHTML = "✅ Receiving screen stream...";
              
  //             if (!data.image) {
  //               console.error('No image data received');
  //               statusDiv.innerHTML = "❌ No image data received";
  //               statusDiv.className = 'error';
  //               return;
  //             }
              
  //             const img = new Image();
  //             img.onload = function() {
  //               console.log('Image loaded successfully');
  //               canvas.width = img.width;
  //               canvas.height = img.height;
  //               ctx.drawImage(img, 0, 0);
  //             };
  //             img.onerror = function() {
  //               console.error('Failed to load image');
  //               statusDiv.innerHTML = "❌ Error loading screen image";
  //               statusDiv.className = 'error';
  //             };
  //             img.src = data.image;
  //           });
            
  //           socket.on("error", (message) => {
  //             statusDiv.innerHTML = "❌ Error: " + message;
  //             statusDiv.className = 'error';
  //             console.error('Socket error:', message);
  //           });
            
  //           socket.on("disconnect", () => {
  //             statusDiv.innerHTML = "❌ Disconnected from server";
  //             statusDiv.className = 'error';
  //           });
            
  //           // Debug: Log all socket events
  //           socket.onAny((event, data) => {
  //             console.log('Socket event:', event, data);
  //           });
            
  //           // Handle window close
  //           window.onbeforeunload = () => {
  //             console.log('Closing viewer window');
  //             socket.disconnect();
  //           };
            
  //         </script>
  //       </body>
  //     </html>
  //   `);
  //   viewerWindow.document.close();
  // };

  return (
    <div className="client-dashboard">
      <h1>Client Dashboard</h1>
      
      <div className="dashboard-controls">
        <button className="refresh-button" onClick={handleRefreshDevices}>
          🔄 Refresh Devices
        </button>
        
        <button
          className="create-user-button"
          onClick={() => setShowUserForm(!showUserForm)}
        >
          {showUserForm ? "Close" : "➕ Create Sub-User"}
        </button>
      </div>
      
      {showUserForm && (
        <form className="create-user-form" onSubmit={handleCreateUser}>
          <input
            type="text"
            name="name"
            placeholder="User Name"
            value={userFormData.name}
            onChange={handleUserInput}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="User Email"
            value={userFormData.email}
            onChange={handleUserInput}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="User Password"
            value={userFormData.password}
            onChange={handleUserInput}
            required
          />
          <button type="submit">Create User</button>
          {userMessage && <p className="message">{userMessage}</p>}
        </form>
      )}
      
      <h2>Registered Devices</h2>
      
      {loading ? (
        <div className="loading">Loading devices...</div>
      ) : error ? (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={handleRefreshDevices}>Try Again</button>
        </div>
      ) : devices.length === 0 ? (
        <div className="no-devices">
          <p>No devices registered yet.</p>
          <p>Start sharing from a device to see it appear here.</p>
        </div>
      ) : (
        <div className="device-grid">
          {devices.map((device) => (
            <div className="device-card" key={device.device_id}>
              <h3>{device.name}</h3>
              <p>
                <strong>Device ID:</strong> {device.device_id}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {device.online ? (
                  <span className="online">🟢 Online</span>
                ) : (
                  <span className="offline">🔴 Offline</span>
                )}
              </p>
              {device.pin && device.online && (
                <p>
                  <strong>PIN:</strong> {device.pin}
                </p>
              )}
              {device.online && (
                <div className="view-options">
                  {device.pin && (
                    <button 
                      className="view-btn"
                      onClick={() => handleViewDevice(device.device_id, device.pin)}
                    >
                      👀 View with PIN
                    </button>
                  )}
                  <button 
                    className="view-btn"
                    onClick={() => handleViewDevice(device.device_id)}
                  >
                    👀 View with Key
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;