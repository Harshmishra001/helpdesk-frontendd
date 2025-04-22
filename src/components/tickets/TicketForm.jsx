import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createTicket } from '../../services/ticketService';
import { AuthContext } from '../../context/AuthContext';
import Alert from '../common/Alert';

const TicketForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation schema
  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .max(100, 'Title cannot be more than 100 characters'),
    description: Yup.string()
      .required('Description is required')
      .max(500, 'Description cannot be more than 500 characters')
  });

  // Initial form values
  const initialValues = {
    title: '',
    description: ''
  };

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      setError('');

      console.log('Creating ticket:', values);

      // For demo purposes, simulate a successful API call
      // In a real app, uncomment the line below
      // await createTicket(values);

      // Simulate API response
      setTimeout(() => {
        resetForm();

        // Store the new ticket in localStorage for demo purposes
        const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
        const newTicket = {
          _id: 'ticket_' + Date.now(),
          title: values.title,
          description: values.description,
          status: 'Active',
          user: {
            _id: user.id,
            name: user.name,
            email: user.email
          },
          notes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        existingTickets.unshift(newTicket); // Add to beginning of array
        localStorage.setItem('tickets', JSON.stringify(existingTickets));

        setIsSubmitting(false);
        navigate('/tickets');
      }, 1500);

      return;
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(err.response?.data?.message || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ticket-form card">
      <div className="card-header">
        <h2 className="card-title">Create New Ticket</h2>
      </div>
      <div className="card-body">
        {error && <Alert type="danger" message={error} />}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  placeholder="Brief description of the issue"
                />
                <ErrorMessage name="title" component="div" className="text-danger" />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  className="form-control"
                  rows="5"
                  placeholder="Detailed description of the issue"
                />
                <ErrorMessage name="description" component="div" className="text-danger" />
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TicketForm;
