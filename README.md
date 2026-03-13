# 🎵 Musi-Love - Connect Through Music

A modern Progressive Web App (PWA) built with React that enables music lovers to connect through their favorite songs. Share your music taste, discover others' playlists, and build a community around music.

![Musi-Love](public/favicon.svg)

## ✨ Features

### 🔐 Authentication
- **Google OAuth Login** - Secure authentication via Firebase
- **User Profiles** - Personalized profiles with photo, name, age, gender, and description
- **Last Seen Status** - Real-time tracking of user activity

### 🎶 Music Management
- **YouTube Integration** - Search and add songs directly from YouTube
- **Custom Playlists** - Organize songs into multiple playlists
- **Default Playlist** - Automatic "My Favorites" playlist
- **Song Cards** - Beautiful thumbnail display with song metadata
- **Add/Delete Songs** - Full CRUD operations on your music library

### 👥 Social Features
- **Users List** - Browse all members sorted by last seen date
- **View Profiles** - Explore other users' music collections
- **Profile Badges** - Gender and age indicators
- **Online Status** - See who's currently active

### 📱 Player Experience
- **YouTube Embedded Player** - Full YouTube playback functionality
- **Sequential Playback** - Auto-play next song when current finishes
- **Playlist Navigation** - Previous/Next controls
- **Visual Playlist** - See all songs with active track highlighting
- **Responsive Player** - Works perfectly on desktop and mobile

### 🌍 Multi-Language Support
- **4 Languages** - English, Spanish, French, Portuguese
- **LocalStorage Persistence** - Language preference saved locally
- **Full Translation** - All UI elements translated

### 📱 PWA Features
- **Installable** - Add to home screen on mobile and desktop
- **Offline Ready** - Service worker caching
- **Responsive Design** - Mobile-first, works on all screen sizes
- **Fast Loading** - Optimized assets and caching strategies

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Firebase account with a project set up
- YouTube Data API v3 key from Google Cloud Console

### Installation

1. **Clone or download this project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Firebase configuration is already set in `src/config.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyDSWitlWh_sRMqlxNd5yWcbX0YPLAfIjTs",
     authDomain: "musi-love.firebaseapp.com",
     projectId: "musi-love",
     storageBucket: "musi-love.firebasestorage.app",
     messagingSenderId: "277579961390",
     appId: "1:277579961390:web:ec7749665ebca0f7d17bbf"
   };
   ```

4. **Configure YouTube API Key**
   
   Open `src/config.js` and replace `YOUR_YOUTUBE_API_KEY_HERE` with your YouTube Data API v3 key:
   
   ```javascript
   export const YOUTUBE_API_KEY = 'YOUR_ACTUAL_API_KEY';
   ```
   
   **How to get a YouTube API key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable "YouTube Data API v3"
   - Go to Credentials → Create Credentials → API Key
   - Copy the key and paste it in `src/config.js`

5. **Generate PWA Icons**
   
   The project includes placeholder files for icons. Generate proper icons:
   - Use [RealFaviconGenerator](https://realfavicongenerator.net/)
   - Upload your logo/icon
   - Generate and download icons
   - Replace `public/icon-192.png` and `public/icon-512.png`

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 🗂️ Project Structure

```
musi-love/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── favicon.svg            # App icon (SVG)
│   ├── icon-192.png           # PWA icon 192x192
│   └── icon-512.png           # PWA icon 512x512
├── src/
│   ├── components/
│   │   ├── Layout.jsx         # Main layout with header/footer
│   │   └── Layout.css
│   ├── contexts/
│   │   ├── AuthContext.jsx    # Firebase authentication
│   │   └── LanguageContext.jsx # i18n translations
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── Users.jsx          # Users list
│   │   ├── MyProfile.jsx      # Current user's profile
│   │   ├── UserProfile.jsx    # Other user's profile
│   │   └── Player.jsx         # YouTube player
│   ├── config.js              # Firebase & YouTube config
│   ├── firebase.js            # Firebase initialization
│   ├── App.jsx                # Main app component
│   ├── App.css                # Global styles
│   ├── index.css              # Base CSS
│   └── main.jsx               # Entry point
├── index.html
├── vite.config.js             # Vite & PWA configuration
└── package.json
```

## 🔥 Firebase Firestore Structure

### Collections

#### `users`
```javascript
{
  uid: string,              // User's Firebase UID
  email: string,            // Google account email
  name: string,             // Display name
  photoURL: string,         // Profile picture URL
  description: string,      // User bio
  age: number,              // User age
  gender: string,           // "male" or "female"
  lastSeen: timestamp,      // Last activity timestamp
  createdAt: timestamp      // Account creation
}
```

#### `songs`
```javascript
{
  userId: string,           // Owner's UID
  videoId: string,          // YouTube video ID
  title: string,            // Video title
  thumbnail: string,        // Thumbnail URL
  playlist: string,         // Playlist name
  addedAt: string          // ISO date string
}
```

### Firestore Security Rules

Add these security rules to your Firebase project:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🎯 User Flow

1. **Landing Page** - User sees welcome screen with sign-in button
2. **Google Sign In** - Authenticate with Google account
3. **Complete Profile** - First-time users fill in age, gender, and description
4. **Users List** - Browse all users (current user shown first)
5. **Add Songs** - Search YouTube and add songs to playlists
6. **View Profiles** - Click on any user to see their music collection
7. **Play Music** - Click on songs to open YouTube player with sequential playback

## 🌐 Supported Languages

- **English** (en) - Default
- **Spanish** (es) - Español
- **French** (fr) - Français
- **Portuguese** (pt) - Português

Language preferences are saved in `localStorage` and persist across sessions.

## 🔧 Configuration

### Default Playlist Name

Edit `src/config.js`:
```javascript
export const DEFAULT_PLAYLIST = 'My Favorites';
```

### Theme Colors

Edit CSS variables in `src/index.css`:
```css
:root {
  --primary-color: #e91e63;    /* Pink */
  --secondary-color: #9c27b0;   /* Purple */
  /* ... */
}
```

## 📱 PWA Installation

### Desktop (Chrome, Edge)
1. Click the install icon in the address bar
2. Or: Menu → Install Musi-Love

### Mobile (Android)
1. Open in Chrome
2. Tap Menu (⋮)
3. Tap "Add to Home screen"

### Mobile (iOS)
1. Open in Safari
2. Tap Share button
3. Tap "Add to Home Screen"

## 🐛 Troubleshooting

### YouTube Search Not Working
- Verify your YouTube API key is correct in `src/config.js`
- Check that YouTube Data API v3 is enabled in Google Cloud Console
- Ensure API key has no restrictions or allow your domain

### Songs Not Saving
- Check Firebase Firestore security rules
- Verify user is authenticated
- Check browser console for errors

### Last Seen Not Updating
- Ensure Firestore timestamp is working correctly
- Check that user has an active internet connection

## 🛠️ Technologies Used

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Firebase** - Authentication & Firestore database
- **YouTube IFrame API** - Video playback
- **YouTube Data API v3** - Video search
- **PWA** - Progressive Web App features
- **Workbox** - Service worker caching

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

If you encounter any issues:
1. Check the Troubleshooting section
2. Review Firebase and YouTube API configurations
3. Check browser console for errors

## 🎉 Features Completed

✅ PWA with offline support
✅ Google OAuth authentication
✅ User profile management
✅ YouTube search integration
✅ Song management (add/delete)
✅ Custom playlists
✅ Users list with last seen
✅ User profile pages
✅ YouTube player with sequential playback
✅ Multi-language support (4 languages)
✅ Responsive design
✅ Modern UI/UX

## 🚧 Future Enhancements

- [ ] Private/public playlists
- [ ] Follow/unfollow users
- [ ] Like/comment on songs
- [ ] Share playlists
- [ ] Search users by name
- [ ] Filter users by age/gender
- [ ] Export/import playlists
- [ ] Dark mode
- [ ] Push notifications
- [ ] Song recommendations

## 📊 Current Status

**Version:** 1.0.0  
**Status:** Production Ready ✅

All core features are implemented and functional. The app is ready for deployment and use!

---

Made with ❤️ and 🎵 by the Musi-Love team
