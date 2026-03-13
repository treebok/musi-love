import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../firebase';
import './UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId === currentUser?.uid) {
      navigate('/my-profile');
      return;
    }
    
    loadUserData();
  }, [userId, currentUser]);

  const loadUserData = async () => {
    try {
      // Load user profile
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUser({ id: userDoc.id, ...userDoc.data() });
      }
      
      // Load user songs
      const songsQuery = query(
        collection(db, 'songs'),
        where('userId', '==', userId)
      );
      const songsSnapshot = await getDocs(songsQuery);
      const songsData = songsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSongs(songsData);
      
      // Extract unique playlists
      const uniquePlaylists = [...new Set(songsData.map(s => s.playlist))];
      setPlaylists(uniquePlaylists);
    } catch (error) {
      console.error('Error loading user data:', error);
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

  const handlePlaySong = (songId) => {
    navigate(`/player/${userId}?song=${songId}&playlist=${selectedPlaylist}`);
  };

  const handlePlayAll = () => {
    if (filteredSongs.length > 0) {
      navigate(`/player/${userId}?song=${filteredSongs[0].id}&playlist=${selectedPlaylist}`);
    }
  };

  const filteredSongs = selectedPlaylist 
    ? songs.filter(s => s.playlist === selectedPlaylist)
    : songs;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container">
        <div className="card text-center">
          <h2>User not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="user-profile-header">
        <div className="profile-banner">
          <img 
            src={user.photoURL} 
            alt={user.name}
            className="avatar avatar-large"
          />
          {isOnline(user.lastSeen) && <div className="online-badge">{t('online')}</div>}
        </div>
        
        <div className="profile-details">
          <h1>{user.name}</h1>
          
          <div className="profile-meta">
            {user.age && (
              <span className="meta-item">
                {user.age} {t('years')} {t('old')}
              </span>
            )}
            {user.gender && (
              <span className="meta-item">
                {user.gender === 'male' ? '♂️' : '♀️'} {user.gender === 'male' ? t('male') : t('female')}
              </span>
            )}
            <span className="meta-item">
              {t('lastSeen')}: {formatLastSeen(user.lastSeen)}
            </span>
          </div>
          
          {user.description && (
            <p className="profile-description">{user.description}</p>
          )}
        </div>
      </div>

      {/* Playlists and Songs */}
      <div className="card mt-3">
        <div className="flex-between mb-3">
          <h2>{t('songs')} ({songs.length})</h2>
          {filteredSongs.length > 0 && (
            <button 
              onClick={handlePlayAll}
              className="button button-primary"
            >
              ▶ {t('playAll')}
            </button>
          )}
        </div>

        {playlists.length > 0 && (
          <div className="playlists-section mb-3">
            <h3>{t('playlists')}</h3>
            <div className="playlists-grid">
              <button
                className={`playlist-chip ${selectedPlaylist === '' ? 'active' : ''}`}
                onClick={() => setSelectedPlaylist('')}
              >
                {t('allSongs')} ({songs.length})
              </button>
              {playlists.map(playlist => (
                <button
                  key={playlist}
                  className={`playlist-chip ${selectedPlaylist === playlist ? 'active' : ''}`}
                  onClick={() => setSelectedPlaylist(playlist)}
                >
                  {playlist} ({songs.filter(s => s.playlist === playlist).length})
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredSongs.length === 0 ? (
          <p className="text-center text-secondary">{t('noSongs')}</p>
        ) : (
          <div className="songs-list">
            {filteredSongs.map((song, index) => (
              <div 
                key={song.id}
                className="song-item"
                onClick={() => handlePlaySong(song.id)}
              >
                <div className="song-number">{index + 1}</div>
                <img 
                  src={song.thumbnail} 
                  alt={song.title}
                  className="song-thumbnail"
                />
                <div className="song-details">
                  <h4>{song.title}</h4>
                  <span className="badge badge-primary">{song.playlist}</span>
                </div>
                <button className="play-button">▶</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
