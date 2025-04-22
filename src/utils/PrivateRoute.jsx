import { useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Helper to check if using a test account
const isTestAccount = (email) => {
  return email && (
    email === 'admin@example.com' ||
    email === 'agent@example.com' ||
    email === 'customer@example.com'
  );
};

// Component for protected routes
const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading, login } = useContext(AuthContext);
  const location = useLocation();

  // Auto-login test accounts if they're in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const testEmail = params.get('testAccount');

    if (testEmail && isTestAccount(testEmail) && !isAuthenticated) {
      console.log('Auto-logging in test account:', testEmail);
      login({ email: testEmail, password: 'password123' });
    }
  }, [location.search, isAuthenticated, login]);

  // Show loading state
  if (loading) {
    return <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Check if we're trying to access a test account directly
    const params = new URLSearchParams(location.search);
    const testEmail = params.get('testAccount');

    if (testEmail && isTestAccount(testEmail)) {
      // We're in the process of auto-logging in, show loading
      return <div className="loading-container">
        <div className="spinner"></div>
        <p>Logging in as {testEmail}...</p>
      </div>;
    }

    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
