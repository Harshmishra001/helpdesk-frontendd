import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { updateTicket } from '../../services/ticketService';
import { formatRelativeTime } from '../../utils/formatDate';
import Alert from '../common/Alert';

const TicketItem = ({ ticket, onStatusChange }) => {
  const { user } = useContext(AuthContext);
  const [currentStatus, setCurrentStatus] = useState(ticket.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
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

  return (
    <div className="ticket-item card">
      <div className="ticket-header flex-between">
        <h3 className="ticket-title">
          <Link to={`/tickets/${ticket._id}`} className="ticket-link">{ticket.title}</Link>
        </h3>
        <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
          {ticket.status}
        </span>
      </div>
      <div className="ticket-body">
        <p className="ticket-description">{ticket.description.substring(0, 100)}...</p>

        {(user.role === 'admin' || user.role === 'agent') && (
          <div className="ticket-actions mt-2">
            {message && <Alert type={messageType} message={message} autoClose={true} duration={3000} />}

            <div className="status-change-container">
              <label htmlFor={`status-select-${ticket._id}`} className="status-label">Status:</label>
              <select
                id={`status-select-${ticket._id}`}
                className="form-control status-select"
                value={currentStatus}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  setIsUpdating(true);
                  setCurrentStatus(newStatus);

                  try {
                    // Update ticket in localStorage
                    const storedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
                    const ticketIndex = storedTickets.findIndex(t => t._id === ticket._id);

                    if (ticketIndex !== -1) {
                      // Update the status
                      storedTickets[ticketIndex] = {
                        ...storedTickets[ticketIndex],
                        status: newStatus,
                        updatedAt: new Date().toISOString()
                      };

                      localStorage.setItem('tickets', JSON.stringify(storedTickets));

                      // Dispatch event to update dashboard
                      const ticketsUpdatedEvent = new CustomEvent('ticketsUpdated', {
                        detail: { ticketId: ticket._id, newStatus }
                      });
                      window.dispatchEvent(ticketsUpdatedEvent);
                    }

                    // Call API service
                    await updateTicket(ticket._id, { status: newStatus });

                    // Show success message
                    setMessageType('success');
                    setMessage(`Status updated to ${newStatus}`);

                    // Notify parent component
                    if (onStatusChange) {
                      onStatusChange(ticket._id, newStatus);
                    }
                  } catch (err) {
                    setMessageType('danger');
                    setMessage('Failed to update status');
                    console.error('Error updating ticket status:', err);
                  } finally {
                    setIsUpdating(false);
                  }
                }}
                disabled={isUpdating}
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
              </select>

              {isUpdating && (
                <div className="status-updating">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="ticket-footer flex-between">
        <div className="ticket-meta">
          <span className="ticket-id">ID: {ticket._id.substring(0, 8)}</span>
          <span className="ticket-customer">Customer: {ticket.user.name}</span>
        </div>
        <div className="ticket-time">
          Updated {formatRelativeTime(ticket.updatedAt)}
        </div>
      </div>
    </div>
  );
};

export default TicketItem;
