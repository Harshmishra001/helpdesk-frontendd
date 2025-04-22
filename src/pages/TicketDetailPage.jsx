import { useContext, useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaEnvelope, FaTicketAlt, FaUser } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Alert from '../components/common/Alert';
import Spinner from '../components/common/Spinner';
import TicketNotes from '../components/tickets/TicketNotes';
import TicketStatus from '../components/tickets/TicketStatus';
import { AuthContext } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';

const TicketDetailPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdateMessage, setStatusUpdateMessage] = useState('');

  // Function to get badge class based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'badge-primary';
      case 'Pending':
        return 'badge-warning';
      case 'Closed':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  // Function to fetch ticket data
  const fetchTicket = async () => {
    let timeoutId;
    try {
      // Only set loading if component is still mounted
      if (isMountedRef.current) setLoading(true);

      // For demo purposes, simulate API response
      // In a real app, uncomment the line below
      // const response = await getTicketById(idRef.current);

      // Get tickets from localStorage
      const storedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');

      // Find the ticket by ID using the current ID parameter
      const currentId = id; // Use the current ID from params
      const foundTicket = storedTickets.find(t => t._id === currentId);

      // Simulate API response
      timeoutId = setTimeout(() => {
        // Check if component is still mounted
        if (!isMountedRef.current) return;

        // If we found the ticket in localStorage, use it
        if (foundTicket) {
          setTicket(foundTicket);
        } else {
          // Otherwise create a mock ticket
          // Get current user from localStorage for demo
          const currentUser = JSON.parse(localStorage.getItem('user')) || {
            name: 'Demo User',
            email: 'demo@example.com',
            role: 'customer'
          };

          // Create sample notes with proper timestamps and user names
          const sampleNotes = [
            {
              text: 'This is the initial ticket submission.',
              createdBy: {
                _id: 'user123',
                name: currentUser.name
              },
              createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
            }
          ];

          const mockTicket = {
            _id: currentId,
            title: 'Sample Ticket',
            description: 'This is a sample ticket description for testing purposes.',
            status: 'Active',
            user: {
              _id: 'user123',
              name: currentUser.name,
              email: currentUser.email
            },
            notes: sampleNotes,
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            updatedAt: new Date(Date.now() - 86400000).toISOString()
          };

          // Add the mock ticket to localStorage
          storedTickets.push(mockTicket);
          localStorage.setItem('tickets', JSON.stringify(storedTickets));

          if (isMountedRef.current) setTicket(mockTicket);
        }

        if (isMountedRef.current) {
          setLoading(false);
          setError('');
        }
      }, 500);

    } catch (err) {
      console.error('Error fetching ticket:', err);
      if (isMountedRef.current) {
        setError(err.response?.data?.message || 'Failed to load ticket');
        setLoading(false);
      }
    }

    // Return cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  };

  // Use a ref to track if the component is mounted
  const isMountedRef = useRef(true);

  // Use a ref to store the id to avoid dependency issues
  const idRef = useRef(id);

  useEffect(() => {
    // Update the ref when id changes
    idRef.current = id;

    const cleanup = fetchTicket();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (cleanup) cleanup();
    };
  }, [id]); // Add id as a dependency to re-fetch when it changes

  // Handle status update
  const handleStatusUpdate = (newStatus) => {
    // Only proceed if component is mounted
    if (!isMountedRef.current) return;

    // Update the local ticket state with the new status
    setTicket(prevTicket => {
      if (!prevTicket) return null;

      return {
        ...prevTicket,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
    });

    // Set status update message
    setStatusUpdateMessage(`Ticket status updated to <strong>${newStatus}</strong>. Dashboard statistics have been updated.`);

    // Clear the message after 5 seconds
    setTimeout(() => {
      if (isMountedRef.current) {
        setStatusUpdateMessage('');
      }
    }, 5000);

    // Refresh the ticket data to ensure everything is in sync
    fetchTicket();

    // Dispatch a custom event to notify other components (like Dashboard) that tickets have been updated
    const ticketsUpdatedEvent = new CustomEvent('ticketsUpdated', {
      detail: { ticketId: id, newStatus: newStatus }
    });
    window.dispatchEvent(ticketsUpdatedEvent);
    console.log('Dispatched ticketsUpdated event with status:', newStatus);
  };

  // Handle note added
  const handleNoteAdded = (noteText) => {
    // Only proceed if component is mounted
    if (!isMountedRef.current) return;

    // Add the new note to the ticket with the actual text from the form
    setTicket(prevTicket => {
      // Make sure we have a valid ticket
      if (!prevTicket) return null;

      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user')) || {
        name: 'Current User',
        email: 'user@example.com'
      };

      // Create a new note with the current user's name and current timestamp
      const newNote = {
        text: noteText || 'New note added', // Use the text from the form or default
        createdBy: {
          _id: currentUser._id || 'user_' + Date.now(),
          name: currentUser.name || 'Current User' // Use the current user's name
        },
        createdAt: new Date().toISOString() // Use the current timestamp
      };

      // Create updated ticket with the new note added
      const updatedTicket = {
        ...prevTicket,
        notes: [...prevTicket.notes, newNote],
        updatedAt: new Date().toISOString()
      };

      try {
        // Update the ticket in localStorage
        const storedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
        const ticketIndex = storedTickets.findIndex(t => t._id === prevTicket._id);

        if (ticketIndex !== -1) {
          storedTickets[ticketIndex] = updatedTicket;
          localStorage.setItem('tickets', JSON.stringify(storedTickets));
        }
      } catch (err) {
        console.error('Error updating ticket in localStorage:', err);
      }

      return updatedTicket;
    });
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert type="danger" message={error} />;
  }

  if (!ticket) {
    return <Alert type="danger" message="Ticket not found" />;
  }

  return (
    <div className="ticket-detail-page">
      <div className="page-header">
        <Link to="/tickets" className="btn btn-primary back-button">
          <FaArrowLeft className="mr-2" /> Back to Tickets
        </Link>
      </div>

      {statusUpdateMessage && (
        <Alert type="success" message={statusUpdateMessage} autoClose={true} duration={5000} />
      )}

      <div className="ticket-detail card">
        <div className="ticket-header flex-between">
          <div>
            <h2 className="ticket-title">{ticket.title}</h2>
            <div className="ticket-meta">
              <div className="ticket-id-badge"><FaTicketAlt className="ticket-icon" /> Ticket ID: <span className="badge badge-secondary">{ticket._id}</span></div>
              <div className="ticket-customer"><FaUser className="ticket-icon" /> Customer: <strong>{ticket.user.name}</strong></div>
              <div className="ticket-email"><FaEnvelope className="ticket-icon" /> Email: <a href={`mailto:${ticket.user.email}`}>{ticket.user.email}</a></div>
            </div>
          </div>
          <div className="ticket-status-container">
            <div className="ticket-status-label">Status:</div>
            <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>
        </div>

        <div className="ticket-body">
          <h3>Description</h3>
          <div className="ticket-description">{ticket.description}</div>
        </div>

        <div className="ticket-footer">
          <div className="ticket-dates">
            <div className="ticket-date-item">
              <span className="ticket-date-label"><FaCalendarAlt className="ticket-icon" /> Created:</span>
              <span className="ticket-date-value">{formatDate(ticket.createdAt)}</span>
            </div>
            <div className="ticket-date-item">
              <span className="ticket-date-label"><FaClock className="ticket-icon" /> Last Updated:</span>
              <span className="ticket-date-value">{formatDate(ticket.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ticket-actions">
        {(user.role === 'admin' || user.role === 'agent') && (
          <div className="status-section card">
            <div className="card-header">
              <h3 className="card-title">Update Ticket Status</h3>
            </div>
            <div className="card-body">
              <TicketStatus ticket={ticket} onStatusUpdate={handleStatusUpdate} />
            </div>
          </div>
        )}
      </div>

      <div className="notes-section">
        <TicketNotes
          ticketId={ticket._id}
          notes={ticket.notes}
          onNoteAdded={handleNoteAdded}
        />
      </div>
    </div>
  );
};

export default TicketDetailPage;
