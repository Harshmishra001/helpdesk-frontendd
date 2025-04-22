import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTicketAlt, FaUsers, FaChartBar, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Helpdesk</h2>
      </div>
      <div className="sidebar-menu">
        <ul>
          {user && user.role === 'admin' && (
            <li className={isActive('/dashboard')}>
              <Link to="/dashboard">
                <FaChartBar /> Dashboard
              </Link>
            </li>
          )}
          <li className={isActive('/tickets')}>
            <Link to="/tickets">
              <FaTicketAlt /> Tickets
            </Link>
          </li>
          {(user && user.role === 'admin' || user && user.role === 'agent') && (
            <li className={isActive('/customers')}>
              <Link to="/customers">
                <FaUsers /> Customers
              </Link>
            </li>
          )}
          <li className={isActive('/profile')}>
            <Link to="/profile">
              <FaUser /> Profile
            </Link>
          </li>
          <li>
            <a href="#!" onClick={logout}>
              <FaSignOutAlt /> Logout
            </a>
          </li>
        </ul>
      </div>
      <div className="sidebar-footer">
        <p>Logged in as: {user && user.name}</p>
        <p className="role-badge">{user && user.role}</p>
      </div>
    </div>
  );
};

export default Sidebar;
