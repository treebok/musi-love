import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../firebase';
import { YOUTUBE_API_KEY, DEFAULT_PLAYLIST } from '../config';
import './MyProfile.css';

const MyProfile = () => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const { t } = useLanguage();
  
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [showAddSong, setShowAddSong] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDescription(userProfile.description || '');
      setAge(userProfile.age || '');
      setGender(userProfile.gender || '');
      loadSongs();
    }
  }, [userProfile]);

  useEffect(() => {
    // Extract unique playlists from songs
    const uniquePlaylists = [...new Set(songs.map(s => s.playlist))];
    setPlaylists(uniquePlaylists);
  }, [songs]);

  const loadSongs = async () => {
    if (!currentUser) return;
    
    try {
      const songsQuery = query(
        collection(db, 'songs'),
        where('userId', '==', currentUser.uid)
      );
      const songsSnapshot = await getDocs(songsQuery);
      const songsData = songsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSongs(songsData);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!age || !gender) {
      alert(t('required'));
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile({
        description,
        age: parseInt(age),
        gender
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const searchYouTube = async () => {
    if (!searchTerm.trim()) return;
    
    if (YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
      alert('Please configure your YouTube API key in src/config.js');
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          searchTerm
        )}&type=video&maxResults=10&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      
      if (data.items) {
        setSearchResults(data.items);
      } else {
        alert('No results found or API error');
      }
    } catch (error) {
      console.error('Error searching YouTube:', error);
      alert('Failed to search YouTube. Please check your API key.');
    } finally {
      setSearching(false);
    }
  };

  const handleAddSong = async (video) => {
    if (!currentUser) return;
    
    const playlistToUse = showNewPlaylist && newPlaylistName.trim() 
      ? newPlaylistName.trim() 
      : selectedPlaylist || DEFAULT_PLAYLIST;

    try {
      await addDoc(collection(db, 'songs'), {
        userId: currentUser.uid,
        videoId: video.id.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.medium.url,
        playlist: playlistToUse,
        addedAt: new Date().toISOString()
      });
      
      await loadSongs();
      setShowAddSong(false);
      setSearchTerm('');
      setSearchResults([]);
      setNewPlaylistName('');
      setShowNewPlaylist(false);
    } catch (error) {
      console.error('Error adding song:', error);
      alert('Failed to add song');
    }
  };

  const handleDeleteSong = async (songId) => {
    if (!window.confirm('Are you sure you want to delete this song?')) return;
    
    try {
      await deleteDoc(doc(db, 'songs', songId));
      await loadSongs();
    } catch (error) {
      console.error('Error deleting song:', error);
      alert('Failed to delete song');
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

  const profileComplete = userProfile?.age && userProfile?.gender;

  return (
    <div className="page-container">
      <div className="profile-header">
        <img 
          src={userProfile?.photoURL} 
          alt={userProfile?.name}
          className="avatar avatar-large"
        />
        <div>
          <h1>{userProfile?.name}</h1>
          <p className="text-secondary">{userProfile?.email}</p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="card mt-3">
        <div className="flex-between mb-2">
          <h2>{t('profile')}</h2>
          {profileComplete && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="button button-outline"
            >
              {t('edit')}
            </button>
          )}
        </div>

        {!profileComplete && !isEditing && (
          <div className="alert alert-warning mb-3">
            <p>{t('completeProfile')}</p>
            <button 
              onClick={() => setIsEditing(true)}
              className="button button-primary mt-2"
            >
              {t('completeProfile')}
            </button>
          </div>
        )}

        {isEditing ? (
          <div>
            <div className="form-group">
              <label className="form-label">{t('description')} ({t('optional')})</label>
              <textarea
                className="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('description')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('age')} *</label>
              <input
                type="number"
                className="input"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={t('age')}
                min="13"
                max="120"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('gender')} *</label>
              <select
                className="select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">{t('selectLanguage')}</option>
                <option value="male">{t('male')}</option>
                <option value="female">{t('female')}</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleSaveProfile}
                className="button button-primary"
                disabled={saving}
              >
                {saving ? t('loading') : t('save')}
              </button>
              {profileComplete && (
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setDescription(userProfile.description || '');
                    setAge(userProfile.age || '');
                    setGender(userProfile.gender || '');
                  }}
                  className="button button-outline"
                >
                  {t('cancel')}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="profile-info">
            {description && (
              <div className="info-item">
                <strong>{t('description')}:</strong>
                <p>{description}</p>
              </div>
            )}
            <div className="info-row">
              <div className="info-item">
                <strong>{t('age')}:</strong>
                <span>{age} {t('years')}</span>
              </div>
              <div className="info-item">
                <strong>{t('gender')}:</strong>
                <span>{gender === 'male' ? t('male') : t('female')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Songs Section */}
      {profileComplete && (
        <div className="card mt-3">
          <div className="flex-between mb-3">
            <h2>{t('songs')} ({songs.length})</h2>
            <button 
              onClick={() => setShowAddSong(!showAddSong)}
              className="button button-primary"
            >
              {showAddSong ? t('cancel') : t('addSong')}
            </button>
          </div>

          {showAddSong && (
            <div className="add-song-section">
              <div className="search-bar">
                <input
                  type="text"
                  className="input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  onKeyPress={(e) => e.key === 'Enter' && searchYouTube()}
                />
                <button 
                  onClick={searchYouTube}
                  className="button button-primary"
                  disabled={searching}
                >
                  {searching ? t('loading') : t('searchYouTube')}
                </button>
              </div>

              {/* Playlist selection */}
              <div className="playlist-selector mt-3">
                <label className="form-label">{t('playlist')}</label>
                <div className="flex gap-2">
                  <select
                    className="select"
                    value={showNewPlaylist ? '' : selectedPlaylist}
                    onChange={(e) => {
                      setSelectedPlaylist(e.target.value);
                      setShowNewPlaylist(false);
                    }}
                    disabled={showNewPlaylist}
                  >
                    <option value="">{DEFAULT_PLAYLIST}</option>
                    {playlists.map(playlist => (
                      <option key={playlist} value={playlist}>{playlist}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setShowNewPlaylist(!showNewPlaylist);
                      setSelectedPlaylist('');
                    }}
                    className="button button-outline"
                  >
                    {showNewPlaylist ? t('cancel') : t('createPlaylist')}
                  </button>
                </div>
                
                {showNewPlaylist && (
                  <input
                    type="text"
                    className="input mt-2"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder={t('playlistName')}
                  />
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="search-results mt-3">
                  <h3>{t('noResults') !== t('noResults') ? 'Results' : 'Results'}</h3>
                  <div className="results-grid">
                    {searchResults.map(video => (
                      <div key={video.id.videoId} className="result-card">
                        <img 
                          src={video.snippet.thumbnails.medium.url} 
                          alt={video.snippet.title}
                        />
                        <div className="result-info">
                          <h4>{video.snippet.title}</h4>
                          <button 
                            onClick={() => handleAddSong(video)}
                            className="button button-primary button-small"
                          >
                            {t('add')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filter by playlist */}
          {playlists.length > 0 && (
            <div className="playlist-filter mb-3">
              <label className="form-label">{t('filterByPlaylist')}</label>
              <select
                className="select"
                value={selectedPlaylist}
                onChange={(e) => setSelectedPlaylist(e.target.value)}
              >
                <option value="">{t('allSongs')}</option>
                {playlists.map(playlist => (
                  <option key={playlist} value={playlist}>{playlist}</option>
                ))}
              </select>
            </div>
          )}

          {filteredSongs.length === 0 ? (
            <p className="text-center text-secondary">{t('noSongs')}</p>
          ) : (
            <div className="songs-grid">
              {filteredSongs.map(song => (
                <div key={song.id} className="song-card">
                  <img src={song.thumbnail} alt={song.title} />
                  <div className="song-info">
                    <h4>{song.title}</h4>
                    <p className="song-playlist">
                      <span className="badge badge-primary">{song.playlist}</span>
                    </p>
                    <button 
                      onClick={() => handleDeleteSong(song.id)}
                      className="button button-danger button-small"
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyProfile;
