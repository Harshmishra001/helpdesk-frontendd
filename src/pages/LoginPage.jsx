import LoginForm from '../components/auth/LoginForm';
import './AuthPages.css';

const LoginPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <h1>Helpdesk</h1>
          <p>Customer Support System</p>
        </div>
        <LoginForm />
        <div className="test-accounts">
          <p>
            <a href="/test-accounts.html" target="_blank" rel="noopener noreferrer">
              Use test accounts
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
