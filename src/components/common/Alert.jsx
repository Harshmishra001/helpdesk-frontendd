import { useEffect, useState } from 'react';

const Alert = ({ type, message, autoClose = true, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  if (!visible) return null;

  return (
    <div className={`alert alert-${type}`}>
      <div dangerouslySetInnerHTML={{ __html: message }} />
      {!autoClose && (
        <button
          className="close-btn"
          onClick={() => setVisible(false)}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
