import RegisterForm from '../components/auth/RegisterForm';
import './AuthPages.css';

const RegisterPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <h1>Helpdesk</h1>
          <p>Customer Support System</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
