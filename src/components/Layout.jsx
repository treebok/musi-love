import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Layout.css';

const Layout = () => {
  const { currentUser, userProfile, signOut } = useAuth();
  const { t, language, changeLanguage, availableLanguages } = useLanguage();
  const navigate = useNavigate();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <span className="logo-icon">🎵</span>
            <span className="logo-text">{t('appName')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            {currentUser && (
              <>
                <Link to="/users" className="nav-link">{t('users')}</Link>
                <Link to="/my-profile" className="nav-link">{t('myProfile')}</Link>
              </>
            )}
          </nav>

          <div className="header-actions">
            {/* Language Selector */}
            <div className="language-selector">
              <button 
                className="language-button"
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              >
                🌐 {language.toUpperCase()}
              </button>
              {showLanguageMenu && (
                <div className="language-menu">
                  {availableLanguages.map(lang => (
                    <button
                      key={lang.code}
                      className={`language-option ${language === lang.code ? 'active' : ''}`}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setShowLanguageMenu(false);
                      }}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {currentUser && userProfile && (
              <>
                <div className="user-info">
                  <img 
                    src={userProfile.photoURL} 
                    alt={userProfile.name}
                    className="avatar"
                  />
                  <span className="user-name">{userProfile.name}</span>
                </div>
                <button onClick={handleSignOut} className="button button-outline">
                  {t('signOut')}
                </button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && currentUser && (
          <nav className="nav-mobile">
            <Link 
              to="/users" 
              className="nav-link-mobile"
              onClick={() => setShowMobileMenu(false)}
            >
              {t('users')}
            </Link>
            <Link 
              to="/my-profile" 
              className="nav-link-mobile"
              onClick={() => setShowMobileMenu(false)}
            >
              {t('myProfile')}
            </Link>
          </nav>
        )}
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2024 {t('appName')} - {t('tagline')}</p>
      </footer>
    </div>
  );
};

export default Layout;
