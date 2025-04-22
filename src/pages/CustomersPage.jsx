import { useContext, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Alert from '../components/common/Alert';
import Spinner from '../components/common/Spinner';
import UserItem from '../components/users/UserItem';
import { AuthContext } from '../context/AuthContext';
import { getUsers } from '../services/userService';

const CustomersPage = () => {
  const { user } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchCustomers = async () => {
      try {
        if (isMounted) setLoading(true);

        const response = await getUsers();

        // Make sure component is still mounted before updating state
        if (!isMounted) return;

        // Get current user from localStorage to avoid dependency on context
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

        // Filter only customers if the user is not an admin
        const filteredUsers = currentUser.role === 'admin'
          ? response.data
          : response.data.filter(u => u.role === 'customer');

        setCustomers(filteredUsers);
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching customers:', err);
          setError(err.response?.data?.message || 'Failed to load customers');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCustomers();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Remove user dependency

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="customers-page">
      <div className="page-header flex-between">
        <h1>Customers</h1>
        {user && user.role === 'admin' && (
          <Link to="/customers/new" className="btn btn-primary">
            <FaPlus /> New User
          </Link>
        )}
      </div>

      {error && <Alert type="danger" message={error} />}

      {customers.length === 0 ? (
        <div className="no-customers card">
          <p>No customers found.</p>
        </div>
      ) : (
        <div className="customers-list grid">
          {customers.map((customer) => (
            <UserItem key={customer._id} user={customer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
