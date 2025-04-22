import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaSync, FaTicketAlt, FaUsers } from 'react-icons/fa';
import Alert from '../components/common/Alert';
import Spinner from '../components/common/Spinner';
import StatCard from '../components/dashboard/StatCard';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  // Function to calculate stats from localStorage
  const calculateStats = () => {
    try {
      setLoading(true);

      // Get fresh data from localStorage
      const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      console.log('Dashboard: Calculating stats with', tickets.length, 'tickets');

      // Log ticket statuses for debugging
      const statusCounts = {
        Active: tickets.filter(ticket => ticket.status === 'Active').length,
        Pending: tickets.filter(ticket => ticket.status === 'Pending').length,
        Closed: tickets.filter(ticket => ticket.status === 'Closed').length
      };
      console.log('Dashboard: Current ticket status counts:', statusCounts);

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Calculate stats
      const calculatedStats = {
        totalTickets: tickets.length,
        activeTickets: statusCounts.Active,
        pendingTickets: statusCounts.Pending,
        closedTickets: statusCounts.Closed,
        totalCustomers: users.filter(user => user.role === 'customer').length || 2, // Default to 2 if no users found
        totalAgents: users.filter(user => user.role === 'agent').length || 1,
        totalAdmins: users.filter(user => user.role === 'admin').length || 1
      };

      // If no tickets in localStorage, use default stats
      if (tickets.length === 0) {
        calculatedStats.totalTickets = 3;
        calculatedStats.activeTickets = 1;
        calculatedStats.pendingTickets = 1;
        calculatedStats.closedTickets = 1;
      }

      // Update the stats state
      setStats(calculatedStats);
      setLoading(false);
      console.log('Dashboard: Stats updated successfully', calculatedStats);

      // Show update message
      setUpdateMessage('Dashboard statistics updated successfully!');
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (err) {
      console.error('Error calculating stats:', err);
      setError('Failed to calculate dashboard stats');

      // Use default stats as fallback
      setStats({
        totalTickets: 3,
        activeTickets: 1,
        pendingTickets: 1,
        closedTickets: 1,
        totalCustomers: 2,
        totalAgents: 1,
        totalAdmins: 1
      });

      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Initial calculation
    if (isMounted) {
      calculateStats();
    }

    // Listen for ticket updates
    const handleTicketsUpdated = (event) => {
      if (isMounted) {
        console.log('Dashboard: Tickets updated event received', event.detail);

        // Add a small delay to ensure localStorage is updated
        setTimeout(() => {
          if (isMounted) {
            // Force recalculation of stats
            calculateStats();
            console.log('Dashboard stats recalculated after ticket update');
          }
        }, 300); // Increased delay for better reliability
      }
    };

    // Add event listener for ticket updates
    window.addEventListener('ticketsUpdated', handleTicketsUpdated);

    // Cleanup function
    return () => {
      isMounted = false;
      window.removeEventListener('ticketsUpdated', handleTicketsUpdated);
    };
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert type="danger" message={error} />;
  }

  // Function to manually refresh stats
  const handleRefresh = () => {
    calculateStats();
  };

  return (
    <div className="dashboard-page">
      {updateMessage && (
        <div className="update-notification">
          <Alert type="success" message={updateMessage} autoClose={true} duration={3000} />
        </div>
      )}

      <div className="page-header flex-between">
        <h1>Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="btn btn-primary"
          title="Refresh dashboard stats"
        >
          <FaSync className={loading ? 'fa-spin' : ''} /> Refresh Stats
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Tickets"
          value={stats.totalTickets}
          icon={<FaTicketAlt />}
          color="primary"
        />
        <StatCard
          title="Active Tickets"
          value={stats.activeTickets}
          icon={<FaExclamationCircle />}
          color="warning"
        />
        <StatCard
          title="Pending Tickets"
          value={stats.pendingTickets}
          icon={<FaExclamationCircle />}
          color="danger"
        />
        <StatCard
          title="Closed Tickets"
          value={stats.closedTickets}
          icon={<FaCheckCircle />}
          color="success"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<FaUsers />}
          color="primary"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
