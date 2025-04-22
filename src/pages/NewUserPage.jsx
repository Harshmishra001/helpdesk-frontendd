import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import UserForm from '../components/users/UserForm';

const NewUserPage = () => {
  return (
    <div className="new-user-page">
      <div className="page-header">
        <Link to="/customers" className="btn btn-secondary">
          <FaArrowLeft /> Back to Customers
        </Link>
      </div>
      
      <UserForm />
    </div>
  );
};

export default NewUserPage;
