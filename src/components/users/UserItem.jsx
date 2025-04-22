import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';

const UserItem = ({ user }) => {
  // Function to get badge class based on role
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-danger';
      case 'agent':
        return 'badge-warning';
      case 'customer':
        return 'badge-primary';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="user-item card">
      <div className="user-header flex-between">
        <h3 className="user-name">
          <Link to={`/customers/${user._id}`}>{user.name}</Link>
        </h3>
        <span className={`badge ${getRoleBadgeClass(user.role)}`}>
          {user.role}
        </span>
      </div>
      <div className="user-body">
        <p className="user-email">{user.email}</p>
      </div>
      <div className="user-footer">
        <div className="user-meta">
          <span className="user-id">ID: {user._id.substring(0, 8)}</span>
          <span className="user-created">Joined: {formatDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
