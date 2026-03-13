import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../firebase';
import './Player.css';

const Player = () => {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ytApiReady, setYtApiReady] = useState(false);
  const [videoEndedTime, setVideoEndedTime] = useState(0);

  const playerRef = useRef(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = () => setYtApiReady(true);
    } else if (window.YT && window.YT.Player) {
      setYtApiReady(true);
    } else {
      window.onYouTubeIframeAPIReady = () => setYtApiReady(true);
    }

    loadData();
  }, [userId, searchParams]);

  useEffect(() => {
    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [player]);

  const loadData = async () => {
    try {
      // Load user profile
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUser({ id: userDoc.id, ...userDoc.data() });
      }

      // Load songs
      const songsQuery = query(
        collection(db, 'songs'),
        where('userId', '==', userId)
      );
      const songsSnapshot = await getDocs(songsQuery);
      let songsData = songsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter by playlist if specified
      const playlistParam = searchParams.get('playlist');
      if (playlistParam) {
        songsData = songsData.filter(s => s.playlist === playlistParam);
      }

      // Sort by playlist to keep them grouped
      songsData.sort((a, b) => a.playlist.localeCompare(b.playlist));

      setSongs(songsData);

      // Find starting song
      const songId = searchParams.get('song');
      if (songId) {
        const songIndex = songsData.findIndex(s => s.id === songId);
        if (songIndex !== -1) {
          setCurrentSongIndex(songIndex);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ytApiReady && songs.length > 0 && !player && playerRef.current && !loading) {
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: '100%',
        width: '100%',
        videoId: songs[currentSongIndex]?.videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1
        },
        events: {
          onReady: () => {
            setIsReady(true);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setVideoEndedTime(Date.now());
            }
          }
        }
      });
      setPlayer(newPlayer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ytApiReady, songs.length, player, loading]);

  useEffect(() => {
    if (videoEndedTime > 0) {
      handleNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoEndedTime]);

  useEffect(() => {
    if (player && isReady && songs.length > 0) {
      player.loadVideoById(songs[currentSongIndex].videoId);
    }
  }, [currentSongIndex, player, isReady, songs]);

  const handleNext = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setCurrentSongIndex(0); // Loop back to first song
    }
  };

  const handlePrevious = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    } else {
      setCurrentSongIndex(songs.length - 1); // Loop to last song
    }
  };

  const handleSongClick = (index) => {
    setCurrentSongIndex(index);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="page-container">
        <div className="card text-center">
          <h2>{t('noSongs')}</h2>
        </div>
      </div>
    );
  }

  const currentSong = songs[currentSongIndex];

  return (
    <div className="player-page">
      <div className="player-container">
        <div className="player-main">
          <div className="player-wrapper">
            <div id="youtube-player" ref={playerRef}></div>
          </div>

          <div className="now-playing">
            <div className="now-playing-header">
              <h2>{t('nowPlaying')}</h2>
              {user && (
                <div className="user-badge">
                  <img src={user.photoURL} alt={user.name} className="avatar avatar-small" />
                  <span>{user.name}</span>
                </div>
              )}
            </div>

            <div className="current-song-info">
              <img src={currentSong.thumbnail} alt={currentSong.title} />
              <div>
                <h3>{currentSong.title}</h3>
                <span className="badge badge-primary">{currentSong.playlist}</span>
              </div>
            </div>

            <div className="player-controls">
              <button
                onClick={handlePrevious}
                className="control-button"
                disabled={songs.length <= 1}
              >
                ⏮ {t('previous')}
              </button>
              <button
                onClick={handleNext}
                className="control-button"
                disabled={songs.length <= 1}
              >
                {t('next')} ⏭
              </button>
            </div>
          </div>
        </div>

        <div className="playlist-sidebar">
          <h3>{t('playlist')} ({songs.length})</h3>
          <div className="playlist-items">
            {songs.map((song, index) => (
              <div
                key={song.id}
                className={`playlist-item ${index === currentSongIndex ? 'active' : ''}`}
                onClick={() => handleSongClick(index)}
              >
                <div className="playlist-item-number">
                  {index === currentSongIndex ? '▶' : index + 1}
                </div>
                <img src={song.thumbnail} alt={song.title} />
                <div className="playlist-item-info">
                  <h4>{song.title}</h4>
                  <span className="playlist-item-badge">{song.playlist}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
