import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaPlus } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <h1>Helpdesk</h1>
      </div>
      <div className="header-right">
        {user && user.role === 'customer' && (
          <Link to="/tickets/new" className="btn btn-primary">
            <FaPlus /> New Ticket
          </Link>
        )}
        <span className="user-info">
          Welcome, {user && user.name}
        </span>
      </div>
    </header>
  );
};

export default Header;
