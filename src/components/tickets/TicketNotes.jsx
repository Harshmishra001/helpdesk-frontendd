import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { formatDate } from '../../utils/formatDate';
import Alert from '../common/Alert';

const TicketNotes = ({ ticketId, notes, onNoteAdded }) => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);

  // Validation schema
  const validationSchema = Yup.object({
    text: Yup.string().required('Note text is required')
  });

  // Initial form values
  const initialValues = {
    text: ''
  };

  // Handle file change
  const handleFileChange = (event) => {
    setFile(event.currentTarget.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      setError('');

      const noteData = {
        text: values.text,
        attachment: file
      };

      console.log('Adding note:', noteData);

      // For demo purposes, simulate a successful API call
      // In a real app, uncomment the line below
      // await addNoteToTicket(ticketId, noteData);

      // Simulate API response
      setTimeout(() => {
        // Notify parent component that a note was added with the text
        if (onNoteAdded) {
          onNoteAdded(values.text);
        }

        // Reset form after successful submission
        resetForm();
        setFile(null);
        setIsSubmitting(false);

        // Show success message
        alert('Note added successfully!');
      }, 1000);

      return;
    } catch (err) {
      console.error('Error adding note:', err);
      setError(err.response?.data?.message || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ticket-notes">
      <h3 className="notes-title">Notes & Replies</h3>

      {/* Notes List */}
      <div className="notes-list card">
        <div className="card-header">
          <h3 className="card-title">Conversation History</h3>
        </div>
        <div className="card-body">
          {notes && notes.length > 0 ? (
            <div className="notes-timeline">
              {notes.map((note, index) => (
                <div key={index} className="note-item">
                  <div className="note-header flex-between">
                    <div className="note-author">
                      <strong>{note.createdBy.name}</strong>
                      <span className={`note-role ${note.createdBy.name.toLowerCase().includes('admin') ? 'role-admin' :
                         note.createdBy.name.toLowerCase().includes('agent') ? 'role-agent' : 'role-customer'}`}>
                        {note.createdBy.name.toLowerCase().includes('admin') ? 'Admin' :
                         note.createdBy.name.toLowerCase().includes('agent') ? 'Agent' : 'Customer'}
                      </span>
                    </div>
                    <div className="note-date">
                      {formatDate(note.createdAt)}
                    </div>
                  </div>
                  <div className="note-body">
                    <p>{note.text}</p>
                    {note.attachment && (
                      <div className="note-attachment">
                        <a href={`http://localhost:5000/${note.attachment}`} target="_blank" rel="noopener noreferrer" className="attachment-link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-paperclip" viewBox="0 0 16 16">
                            <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
                          </svg>
                          View Attachment
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-notes">
              <p>No notes or replies yet.</p>
              <p className="text-muted">Be the first to add a note to this ticket.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Form */}
      <div className="add-note card">
        <div className="card-header">
          <h3 className="card-title">Add a Reply</h3>
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
                  <Field
                    as="textarea"
                    id="text"
                    name="text"
                    className="form-control"
                    rows="4"
                    placeholder="Type your reply here..."
                  />
                  <ErrorMessage name="text" component="div" className="text-danger" />
                </div>

                <div className="form-group">
                  <label htmlFor="attachment" className="attachment-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-paperclip" viewBox="0 0 16 16">
                      <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
                    </svg>
                    Add Attachment (optional)
                  </label>
                  <input
                    type="file"
                    id="attachment"
                    name="attachment"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                  {file && (
                    <div className="selected-file">
                      <span className="file-name">{file.name}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => setFile(null)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      'Send Reply'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default TicketNotes;
