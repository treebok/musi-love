import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Home.css';

const Home = () => {
  const { currentUser, userProfile, signInWithGoogle, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/users');
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (currentUser && userProfile) {
    navigate('/users');
    return null;
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">🎵❤️</span>
            <br />
            {t('welcome')}
          </h1>
          <p className="hero-subtitle">{t('welcomeMessage')}</p>
          <button 
            onClick={handleSignIn} 
            className="button button-primary button-large"
          >
            {t('signIn')}
          </button>
        </div>
        
        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">🎶</div>
            <h3>{t('addSong')}</h3>
            <p>Search and add your favorite songs from YouTube</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>{t('users')}</h3>
            <p>Connect with other music lovers</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>{t('playlists')}</h3>
            <p>Organize your songs into custom playlists</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
