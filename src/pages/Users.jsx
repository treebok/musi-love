import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../firebase';
import './Users.css';

const Users = () => {
  const { currentUser, userProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('lastSeen', 'desc')
      );
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Move current user to the top
      const currentUserData = usersData.find(u => u.uid === currentUser?.uid);
      const otherUsers = usersData.filter(u => u.uid !== currentUser?.uid);
      
      if (currentUserData) {
        setUsers([currentUserData, ...otherUsers]);
      } else {
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return t('offline');
    
    const lastSeenDate = lastSeen.toDate ? lastSeen.toDate() : new Date(lastSeen);
    const now = new Date();
    const diffMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffMinutes < 5) return t('online');
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  const isOnline = (lastSeen) => {
    if (!lastSeen) return false;
    
    const lastSeenDate = lastSeen.toDate ? lastSeen.toDate() : new Date(lastSeen);
    const now = new Date();
    const diffMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    return diffMinutes < 5;
  };

  const handleUserClick = (user) => {
    if (user.uid === currentUser?.uid) {
      navigate('/my-profile');
    } else {
      navigate(`/user/${user.uid}`);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{t('users')}</h1>
        <p className="text-secondary">{users.length} {users.length === 1 ? t('member') : t('members')}</p>
      </div>

      {users.length === 0 ? (
        <div className="card text-center">
          <p className="text-secondary">{t('noUsers')}</p>
        </div>
      ) : (
        <div className="users-grid">
          {users.map(user => (
            <div 
              key={user.id}
              className={`user-card ${user.uid === currentUser?.uid ? 'current-user' : ''}`}
              onClick={() => handleUserClick(user)}
            >
              <div className="user-card-header">
                <img 
                  src={user.photoURL} 
                  alt={user.name}
                  className="avatar"
                />
                {isOnline(user.lastSeen) && <div className="online-indicator"></div>}
              </div>
              
              <div className="user-card-body">
                <h3>{user.name}</h3>
                {user.uid === currentUser?.uid && (
                  <span className="badge badge-primary">{t('myProfile')}</span>
                )}
                
                <div className="user-meta">
                  {user.age && (
                    <span>
                      {user.age} {t('years')} {t('old')}
                    </span>
                  )}
                  {user.gender && (
                    <span>
                      {user.gender === 'male' ? '♂️' : '♀️'} {user.gender === 'male' ? t('male') : t('female')}
                    </span>
                  )}
                </div>
                
                {user.description && (
                  <p className="user-description">{user.description}</p>
                )}
                
                <div className="user-footer">
                  <span className={`last-seen ${isOnline(user.lastSeen) ? 'online' : ''}`}>
                    {formatLastSeen(user.lastSeen)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
