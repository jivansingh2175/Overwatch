// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
// import Dashboard from './pages/dashboard';
// import AdminPanel from './adminPanel';
// import DeviceViewer from './pages/deviceViewer';
// import Login from './pages/login';
// import Signup from './pages/signup';
// import ProtectedRoute from './pages/protectedRoute';

// function AppContent() {
//   const user = JSON.parse(localStorage.getItem('user'));
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   return (
//     <div className="App p-4 bg-gray-100 min-h-screen">
//       <nav className="mb-6 flex justify-between items-center">
//         <h1 className="text-xl font-bold">Remote Control System</h1>
//         <div className="space-x-4">
//           <Link to="/" className="text-blue-600">Dashboard</Link>
//           {user?.role === 'admin' && (
//             <Link to="/admin" className="text-green-600">Admin Panel</Link>
//           )}
//           <Link to="/viewer" className="text-purple-600">Viewer</Link>
//           {!user && (
//             <>
//               <Link to="/login" className="text-gray-600">Login</Link>
//               <Link to="/signup" className="text-gray-600">Signup</Link>
//             </>
//           )}
//           {user && (
//             <button onClick={handleLogout} className="text-red-500">Logout</button>
//           )}
//         </div>
//       </nav>

//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute adminOnly>
//               <AdminPanel />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/viewer"
//           element={
//             <ProtectedRoute>
//               <DeviceViewer />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </div>
//   );
// }

// export default function WrappedApp() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
// import Dashboard from './pages/dashboard';
// import AdminPanel from './pages/adminPanel';
// import DeviceViewer from './pages/deviceViewer';
// import Login from './pages/login';
// import Signup from './pages/signup';
// import Navbar from './pages/navbar'; // ✅ Correct path to your navbar component
// import ProtectedRoute from './pages/protectedRoute';

// function AppContent() {
//   const user = JSON.parse(localStorage.getItem('user'));
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   return (
//     <div className="App p-4 bg-gray-100 min-h-screen">
//       <nav className="mb-6 flex justify-between items-center">
//         <h1 className="text-xl font-bold">Overwatch</h1>
//         <div className="space-x-4">
//           <Link to="/" className="text-blue-600">Dashboard</Link>
//           {user?.role === 'admin' && (
//             <Link to="/admin" className="text-green-600">Admin Panel</Link>
//           )}
//           <Link to="/viewer" className="text-purple-600">Viewer</Link>
//           {!user && (
//             <>
//               <Link to="/login" className="text-gray-600">Login</Link>
//               <Link to="/signup" className="text-gray-600">Signup</Link>
//             </>
//           )}
//           {user && (
//             <button onClick={handleLogout} className="text-red-500">Logout</button>
//           )}
//         </div>
//       </nav>

//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute adminOnly>
//               <AdminPanel />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/viewer"
//           element={
//             <ProtectedRoute>
//               <DeviceViewer />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </div>
//   );
// }

// export default function WrappedApp() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }




// function AppContent() {
//   return (
//     <div className="App bg-gray-100 min-h-screen">
//       <Navbar /> {/* ✅ Navbar is now a reusable component at the top */}

//       <div className="p-4">
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />

//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//   path="/admin"
//   element={
//     <ProtectedRoute allowedRoles={['superadmin']}>
//       <AdminPanel />
//     </ProtectedRoute>
//   }
// />

//           <Route
//   path="/client"
//   element={
//     <ProtectedRoute allowedRoles={['client']}>
//       <ClientDashboard />
//     </ProtectedRoute>
//   }
// />

//           {/* <Route
//             path="/viewer"
//             element={
//               <ProtectedRoute>
//                 <DeviceViewer />
//               </ProtectedRoute>
//             }
//           /> */}
           
// <Route
//   path="/viewer"
//   element={
//     <ProtectedRoute allowedRoles={['superadmin', 'client', 'user']}>
//       <DeviceViewer />
//     </ProtectedRoute>
//   }
// />

//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }
// export default function WrappedApp() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }





// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Dashboard from './pages/dashboard';
// import SuperadminDashboard from './pages/superadminDashboard';

// import ErrorBoundary from './pages/errorBoundary';
// import ClientDashboard from './pages/clientDashboard';
// import DeviceViewer from './pages/deviceViewer';
// import Login from './pages/login';
// import Signup from './pages/signup';
// import Navbar from './pages/navbar';
// import ProtectedRoute from './pages/protectedRoute';

// function AppContent() {
//   return (
//     <div className="App bg-gray-100 min-h-screen">
//       <Navbar />
//       <div className="p-4">
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
          
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//   path="/admin-dashboard"
//   element={
//     <ProtectedRoute allowedRoles={['superadmin']}>
//       <SuperadminDashboard />
//     </ProtectedRoute>
//   }
// />


//           <Route
//             path="/client"
//             element={
//               <ProtectedRoute allowedRoles={['client']}>
//                 <ClientDashboard />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/viewer"
//             element={
//               <ProtectedRoute allowedRoles={['superadmin', 'client', 'user']}>
//                 <DeviceViewer />
//               </ProtectedRoute>
//             }
//           />


//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
        
//       </div>
//     </div>
//   );
// }

// export default function WrappedApp() {
//   return (
//     <Router>
//       <ErrorBoundary>
//         <AppContent />
//       </ErrorBoundary>
//     </Router>
//   );
// }




import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SuperadminDashboard from './pages/superadminDashboard';
import ClientDashboard from './pages/clientDashboard';
import DeviceViewer from './pages/deviceViewer';
import Login from './pages/login';
import Signup from './pages/signup';
import Navbar from './pages/navbar';
import ProtectedRoute from './pages/protectedRoute';
import ErrorBoundary from './pages/errorBoundary';
import RoleBasedDashboard from './pages/roleBaseDashboard';
import UserDashboard from './pages/userDashboard'; // ✅ NEW

function AppContent() {
  return (
    <div className="App bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoleBasedDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperadminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/client"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/viewer"
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'client', 'user']}>
                <DeviceViewer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Router>
  );
}
