import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-page">
      <div className="unauthorized-content">
        <h1>403</h1>
        <h2>Unauthorized Access</h2>
        <p>You do not have permission to access this page.</p>
        <Link to="/" className="btn btn-primary">
          <FaHome /> Go Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
