import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import TicketForm from '../components/tickets/TicketForm';

const NewTicketPage = () => {
  return (
    <div className="new-ticket-page">
      <div className="page-header">
        <Link to="/tickets" className="btn btn-secondary">
          <FaArrowLeft /> Back to Tickets
        </Link>
      </div>
      
      <TicketForm />
    </div>
  );
};

export default NewTicketPage;
