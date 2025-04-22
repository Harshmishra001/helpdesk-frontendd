import { useCallback, useContext, useEffect, useState } from 'react';
import { FaPlus, FaSync } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import Alert from '../components/common/Alert';
import Spinner from '../components/common/Spinner';
import TicketItem from '../components/tickets/TicketItem';
import { AuthContext } from '../context/AuthContext';

const TicketsPage = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdateMessage, setStatusUpdateMessage] = useState('');
  const location = useLocation();

  // Create a memoized fetchTickets function
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // For demo purposes, get tickets from localStorage
      // In a real app, uncomment the line below
      // const response = await getTickets();
      // setTickets(response.data);

      // Simulate API response
      const timeoutId = setTimeout(() => {
        try {
          // Get tickets from localStorage
          const storedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');

          // If no tickets in localStorage, create some demo tickets
          if (storedTickets.length === 0) {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const demoTickets = [
              {
                _id: 'ticket_1',
                title: 'Cannot access my account',
                description: 'I\'m having trouble logging into my account. It says my password is incorrect but I\'m sure it\'s right.',
                status: 'Active',
                user: {
                  _id: currentUser?._id || 'user_1',
                  name: currentUser?.name || 'John Doe',
                  email: currentUser?.email || 'john@example.com'
                },
                notes: [],
                createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                updatedAt: new Date(Date.now() - 7200000).toISOString()
              },
              {
                _id: 'ticket_2',
                title: 'Payment issue',
                description: 'My payment was processed but I haven\'t received the product yet.',
                status: 'Pending',
                user: {
                  _id: currentUser?._id || 'user_1',
                  name: currentUser?.name || 'John Doe',
                  email: currentUser?.email || 'john@example.com'
                },
                notes: [],
                createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                updatedAt: new Date(Date.now() - 86400000).toISOString()
              }
            ];

            localStorage.setItem('tickets', JSON.stringify(demoTickets));
            setTickets(demoTickets);
          } else {
            setTickets(storedTickets);
          }

          setLoading(false);
        } catch (innerErr) {
          console.error('Error processing tickets:', innerErr);
          setError('Failed to process tickets data');
          setLoading(false);
        }
      }, 500);

      // Cleanup function to prevent state updates if component unmounts
      return () => clearTimeout(timeoutId);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.response?.data?.message || 'Failed to load tickets');
      setLoading(false);
    }
  }, []); // Remove user from dependencies

  // Fetch tickets when component mounts or location changes
  useEffect(() => {
    const fetchData = fetchTickets();
    // This will refetch tickets when navigating back from creating a ticket
    return () => {
      // Cleanup any pending operations
      if (fetchData && typeof fetchData.then === 'function') {
        fetchData.catch(err => console.error('Cleanup error:', err));
      }
    };
  }, [fetchTickets]); // Remove location.pathname dependency

  // Function to manually refresh tickets
  const handleRefresh = () => {
    fetchTickets();
  };

  // Handle ticket status change
  const handleStatusChange = (ticketId, newStatus) => {
    // Update the ticket in the local state
    setTickets(prevTickets => {
      return prevTickets.map(ticket => {
        if (ticket._id === ticketId) {
          return {
            ...ticket,
            status: newStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return ticket;
      });
    });

    // Show status update message
    setStatusUpdateMessage(`Ticket status updated to ${newStatus}`);
    setTimeout(() => setStatusUpdateMessage(''), 3000);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="tickets-page">
      <div className="page-header flex-between">
        <div className="flex-start">
          <h1>Tickets</h1>
          <button
            onClick={handleRefresh}
            className="btn btn-outline-primary ml-2"
            title="Refresh tickets"
            disabled={loading}
          >
            <FaSync className={loading ? 'fa-spin' : ''} />
          </button>
        </div>
        {user && user.role === 'customer' && (
          <Link to="/tickets/new" className="btn btn-primary">
            <FaPlus /> New Ticket
          </Link>
        )}
      </div>

      {error && <Alert type="danger" message={error} />}
      {statusUpdateMessage && <Alert type="success" message={statusUpdateMessage} autoClose={true} duration={3000} />}

      {tickets.length === 0 ? (
        <div className="no-tickets card">
          <p>No tickets found.</p>
          {user && user.role === 'customer' && (
            <Link to="/tickets/new" className="btn btn-primary">
              Create your first ticket
            </Link>
          )}
        </div>
      ) : (
        <div className="tickets-list">
          {tickets.map((ticket) => (
            <TicketItem
              key={ticket._id}
              ticket={ticket}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
