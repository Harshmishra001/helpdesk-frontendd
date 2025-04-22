import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';

// Layout
import Layout from './components/layout/Layout';
import './components/layout/Layout.css';

// Pages
import CustomersPage from './pages/CustomersPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import NewTicketPage from './pages/NewTicketPage';
import NewUserPage from './pages/NewUserPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import TicketDetailPage from './pages/TicketDetailPage';
import TicketsPage from './pages/TicketsPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute allowedRoles={['customer', 'agent', 'admin']} />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/tickets" replace />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/tickets/:id" element={<TicketDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Customer Routes */}
              <Route path="/tickets/new" element={<NewTicketPage />} />

              {/* Agent & Admin Routes */}
              <Route path="/customers" element={<CustomersPage />} />

              {/* Admin Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/customers/new" element={<NewUserPage />} />
            </Route>
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
