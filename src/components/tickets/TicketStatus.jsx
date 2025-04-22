import { useState } from 'react';
import { updateTicket } from '../../services/ticketService';
import Alert from '../common/Alert';

const TicketStatus = ({ ticket, onStatusUpdate }) => {
  const [status, setStatus] = useState(ticket.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle status change
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsUpdating(true);
      setError('');
      setSuccess('');

      // Update ticket in localStorage directly
      const storedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      const ticketIndex = storedTickets.findIndex(t => t._id === ticket._id);

      if (ticketIndex !== -1) {
        // Update the status
        storedTickets[ticketIndex] = {
          ...storedTickets[ticketIndex],
          status: status,
          updatedAt: new Date().toISOString()
        };

        localStorage.setItem('tickets', JSON.stringify(storedTickets));

        // Dispatch a global event to notify other components (like Dashboard) that tickets have been updated
        const ticketsUpdatedEvent = new CustomEvent('ticketsUpdated', {
          detail: { ticketId: ticket._id, newStatus: status }
        });
        window.dispatchEvent(ticketsUpdatedEvent);
        console.log('Dispatched ticketsUpdated event with status:', status);
      }

      // Also call the API update function
      await updateTicket(ticket._id, { status });

      // Show success message with status color
      const statusColor = status === 'Active' ? 'primary' :
                         status === 'Pending' ? 'warning' : 'success';
      setSuccess(`Ticket status updated to <strong>${status}</strong>`);

      // Notify parent component that status was updated
      if (onStatusUpdate) {
        onStatusUpdate(status);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="ticket-status">
      {error && <Alert type="danger" message={error} />}
      {success && <Alert type="success" message={success} />}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="status-selector">
            <div className="status-options">
              <div className="status-option">
                <input
                  type="radio"
                  id="status-active"
                  name="status"
                  value="Active"
                  checked={status === 'Active'}
                  onChange={handleStatusChange}
                />
                <label htmlFor="status-active" className="status-label active-label">
                  <span className="status-dot active-dot"></span>
                  Active
                </label>
              </div>

              <div className="status-option">
                <input
                  type="radio"
                  id="status-pending"
                  name="status"
                  value="Pending"
                  checked={status === 'Pending'}
                  onChange={handleStatusChange}
                />
                <label htmlFor="status-pending" className="status-label pending-label">
                  <span className="status-dot pending-dot"></span>
                  Pending
                </label>
              </div>

              <div className="status-option">
                <input
                  type="radio"
                  id="status-closed"
                  name="status"
                  value="Closed"
                  checked={status === 'Closed'}
                  onChange={handleStatusChange}
                />
                <label htmlFor="status-closed" className="status-label closed-label">
                  <span className="status-dot closed-dot"></span>
                  Closed
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Ticket Status'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketStatus;
