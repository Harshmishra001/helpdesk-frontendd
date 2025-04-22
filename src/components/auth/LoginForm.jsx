import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext';
import Alert from '../common/Alert';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  // Initial form values
  const initialValues = {
    email: '',
    password: ''
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      setError('');

      await login(values);
      navigate('/tickets');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form card">
      <div className="card-header">
        <h2 className="card-title text-center">Login</h2>
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
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Email address"
                />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                />
                <ErrorMessage name="password" component="div" className="text-danger" />
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-3">
          <h5>Test Credentials</h5>
          <div className="credentials-container">
            <div className="credential-item">
              <strong>Customer:</strong>
              <div>Email: customer@example.com</div>
              <div>Password: password123</div>
            </div>
            <div className="credential-item">
              <strong>Admin:</strong>
              <div>Email: admin@example.com</div>
              <div>Password: password123</div>
            </div>
            <div className="credential-item">
              <strong>Agent:</strong>
              <div>Email: agent@example.com</div>
              <div>Password: password123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
