// // src/pages/roleBasedDashboard.jsx
// import React from 'react';
// import Dashboard from './dashboard';
// import ClientDashboard from './clientDashboard';
// import SuperadminDashboard from './superadminDashboard';

// const RoleBasedDashboard = () => {
//   const user = JSON.parse(localStorage.getItem('user'));

//   if (!user) return <p>Loading...</p>;

//   switch (user.role) {
//     case 'superadmin':
//       return <SuperadminDashboard />;
//     case 'client':
//       return <ClientDashboard />;
//     case 'user':
//       return <Dashboard />;
//     default:
//       return <p>Invalid role</p>;
//   }
// };

// export default RoleBasedDashboard;



// src/pages/roleBaseDashboard.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleBasedDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.role) {
      navigate('/login');
      return;
    }

    switch (user.role) {
      case 'superadmin':
        navigate('/admin-dashboard');
        break;
      case 'client':
        navigate('/client');
        break;
      case 'user':
        navigate('/user-dashboard');
        break;
      default:
        navigate('/login');
    }
  }, [navigate]);

  return <p>Redirecting...</p>;
};

export default RoleBasedDashboard;
