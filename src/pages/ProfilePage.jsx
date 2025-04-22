import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    // Create profile with additional fields if needed
    if (currentUser && currentUser.email) {
      setProfile({
        ...currentUser,
        createdAt: currentUser.createdAt || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago if not set
      });
    } else if (user) {
      // Fallback to context user if localStorage is empty
      setProfile({
        ...user,
        createdAt: user.createdAt || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago if not set
      });
    }
  }, [user]);

  // If no profile is available, show a simple message
  if (!profile) {
    return (
      <div className="profile-page">
        <h1>My Profile</h1>
        <div className="card">
          <p className="p-3">Loading profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <div className="profile-card card">
        <div className="profile-header">
          <h2>{profile.name}</h2>
          <span className={`badge badge-${profile.role === 'admin' ? 'danger' : profile.role === 'agent' ? 'warning' : 'primary'}`}>
            {profile.role}
          </span>
        </div>

        <div className="profile-body">
          <div className="profile-info">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Account Created:</strong> {formatDate(profile.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
