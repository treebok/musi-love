# 🔌 API Integration Guide

This guide explains how Musi-Love integrates with external APIs.

## 📺 YouTube Integration

Musi-Love uses two YouTube APIs:

### 1. YouTube Data API v3 (for search)

**Purpose:** Search for YouTube videos

**Endpoint:** `https://www.googleapis.com/youtube/v3/search`

**Implementation:** `src/pages/MyProfile.jsx` line ~107

```javascript
const searchYouTube = async () => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      searchTerm
    )}&type=video&maxResults=10&key=${YOUTUBE_API_KEY}`
  );
  const data = await response.json();
  // Process results...
};
```

**Parameters:**
- `part=snippet` - Returns video metadata
- `q=search_term` - Search query
- `type=video` - Only return videos (not playlists/channels)
- `maxResults=10` - Number of results (1-50)
- `key=YOUR_API_KEY` - API authentication

**Response Format:**
```javascript
{
  items: [
    {
      id: {
        videoId: "dQw4w9WgXcQ"
      },
      snippet: {
        title: "Video Title",
        thumbnails: {
          medium: {
            url: "https://i.ytimg.com/vi/..."
          }
        }
      }
    }
  ]
}
```

**Quota Cost:** 100 units per request

**Daily Quota:** 10,000 units (default)
- = ~100 searches per day
- Can request quota increase

### 2. YouTube IFrame Player API (for playback)

**Purpose:** Embed and control YouTube videos

**Implementation:** `src/pages/Player.jsx` line ~26

```javascript
// Load API
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
document.body.appendChild(tag);

// Initialize player
window.onYouTubeIframeAPIReady = () => {
  new window.YT.Player('youtube-player', {
    videoId: 'dQw4w9WgXcQ',
    events: {
      onReady: (event) => {
        // Player ready
      },
      onStateChange: (event) => {
        // Player state changed
      }
    }
  });
};
```

**Player States:**
- `-1` - Unstarted
- `0` - Ended
- `1` - Playing
- `2` - Paused
- `3` - Buffering
- `5` - Video cued

**No API key required** - Free to use

**Documentation:** https://developers.google.com/youtube/iframe_api_reference

## 🔥 Firebase Integration

### Firebase Authentication

**Purpose:** Google OAuth login

**Implementation:** `src/contexts/AuthContext.jsx` line ~34

```javascript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};
```

**User Object:**
```javascript
{
  uid: "ABC123...",
  email: "user@gmail.com",
  displayName: "John Doe",
  photoURL: "https://..."
}
```

**Free Tier:**
- 50,000 monthly active users
- Unlimited authentications

### Firestore Database

**Purpose:** Store user data and songs

**Implementation:** Various files

#### Writing Data

```javascript
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';

// Add document with auto-generated ID
await addDoc(collection(db, 'songs'), {
  userId: user.uid,
  title: "Song Title",
  videoId: "abc123"
});

// Set document with specific ID
await setDoc(doc(db, 'users', user.uid), {
  name: "John Doe",
  age: 25
});
```

#### Reading Data

```javascript
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';

// Get single document
const docSnap = await getDoc(doc(db, 'users', userId));
const data = docSnap.data();

// Query collection
const q = query(
  collection(db, 'songs'),
  where('userId', '==', userId)
);
const querySnapshot = await getDocs(q);
querySnapshot.forEach(doc => {
  console.log(doc.id, doc.data());
});
```

#### Updating Data

```javascript
import { updateDoc, doc } from 'firebase/firestore';

await updateDoc(doc(db, 'users', userId), {
  age: 26,
  lastSeen: serverTimestamp()
});
```

#### Deleting Data

```javascript
import { deleteDoc, doc } from 'firebase/firestore';

await deleteDoc(doc(db, 'songs', songId));
```

**Free Tier:**
- 1 GB storage
- 50K reads/day
- 20K writes/day
- 20K deletes/day

## 🔐 API Security Best Practices

### YouTube API Key

**Development:**
```javascript
// src/config.js
export const YOUTUBE_API_KEY = 'AIza...'; // OK for testing
```

**Production:**
1. **Restrict to your domain:**
   - Google Cloud Console → Credentials
   - Edit API key
   - Application restrictions: HTTP referrers
   - Add: `https://yourdomain.com/*`

2. **Restrict to YouTube API:**
   - API restrictions: Restrict key
   - Select: YouTube Data API v3

### Firebase Security Rules

**Implement proper Firestore rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Anyone can read
      allow read: if request.auth != null;
      // Only owner can write
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /songs/{songId} {
      allow read: if request.auth != null;
      // Validate data structure on create
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.keys().hasAll(['userId', 'videoId', 'title']);
      // Only owner can update/delete
      allow update, delete: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Environment Variables

**For sensitive data:**

```bash
# .env (don't commit!)
VITE_YOUTUBE_API_KEY=your_key_here
```

```javascript
// src/config.js
export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
```

## 📊 API Usage Monitoring

### YouTube API Quota

**Check usage:**
1. Google Cloud Console
2. APIs & Services → Dashboard
3. YouTube Data API v3 → Quotas

**Optimize usage:**
- Cache search results
- Limit search results (maxResults)
- Implement debouncing for search input
- Consider server-side caching

### Firebase Usage

**Check usage:**
1. Firebase Console
2. Usage and billing
3. Review reads/writes/deletes

**Optimize usage:**
- Use queries instead of fetching all docs
- Implement pagination
- Cache data locally when possible
- Batch operations when possible

## 🚨 Error Handling

### YouTube API Errors

```javascript
try {
  const response = await fetch(/* YouTube API */);
  const data = await response.json();
  
  if (data.error) {
    console.error('YouTube API Error:', data.error);
    // Show user-friendly error
    alert('Failed to search YouTube. Please try again.');
  }
} catch (error) {
  console.error('Network error:', error);
  alert('Network error. Please check your connection.');
}
```

### Firebase Errors

```javascript
try {
  await addDoc(collection(db, 'songs'), songData);
} catch (error) {
  if (error.code === 'permission-denied') {
    alert('You don\'t have permission to perform this action.');
  } else if (error.code === 'unavailable') {
    alert('Service temporarily unavailable. Please try again.');
  } else {
    console.error('Firebase error:', error);
    alert('An error occurred. Please try again.');
  }
}
```

## 🔄 API Rate Limiting

### Client-Side Debouncing

```javascript
import { useState, useEffect } from 'react';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// Usage
const debouncedSearchTerm = useDebounce(searchTerm, 500);
useEffect(() => {
  if (debouncedSearchTerm) {
    searchYouTube(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);
```

## 📚 Additional Resources

### YouTube
- **API Documentation:** https://developers.google.com/youtube/v3
- **IFrame Player:** https://developers.google.com/youtube/iframe_api_reference
- **Quota Calculator:** https://developers.google.com/youtube/v3/determine_quota_cost

### Firebase
- **Auth Documentation:** https://firebase.google.com/docs/auth
- **Firestore Documentation:** https://firebase.google.com/docs/firestore
- **Security Rules:** https://firebase.google.com/docs/rules

### Best Practices
- **API Design:** https://cloud.google.com/apis/design
- **Error Handling:** https://web.dev/error-handling/
- **Security:** https://owasp.org/www-project-web-security-testing-guide/

---

## 🎯 Quick Reference

| API | Purpose | Authentication | Cost |
|-----|---------|----------------|------|
| YouTube Data API v3 | Search videos | API Key | 100 units/search |
| YouTube IFrame API | Play videos | None | Free |
| Firebase Auth | Google OAuth | Firebase config | Free (50K MAU) |
| Firestore | Database | Firebase config | Free (50K reads/day) |

---

**Need help with APIs? Check the documentation links above or open an issue!**
