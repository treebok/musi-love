# ⚡ Quick Reference - Musi-Love

A quick reference guide for common tasks and code snippets.

## 🚀 Quick Start

```bash
# Install
npm install

# Run dev server
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

## 📂 Key Files

| File | Purpose |
|------|---------|
| `src/config.js` | API keys and configuration |
| `src/firebase.js` | Firebase initialization |
| `src/contexts/AuthContext.jsx` | Authentication logic |
| `src/contexts/LanguageContext.jsx` | Translations |
| `vite.config.js` | Build and PWA config |
| `public/manifest.json` | PWA manifest |

## 🎨 Color Variables

```css
--primary-color: #e91e63      /* Pink */
--secondary-color: #9c27b0    /* Purple */
--success: #4caf50            /* Green */
--error: #f44336              /* Red */
```

## 🔧 Common Code Snippets

### Get Current User

```javascript
import { useAuth } from '../contexts/AuthContext';

const { currentUser, userProfile } = useAuth();
```

### Translate Text

```javascript
import { useLanguage } from '../contexts/LanguageContext';

const { t } = useLanguage();
return <h1>{t('welcome')}</h1>;
```

### Navigate

```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/users');
```

### Add Song to Firestore

```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

await addDoc(collection(db, 'songs'), {
  userId: user.uid,
  videoId: 'abc123',
  title: 'Song Title',
  thumbnail: 'https://...',
  playlist: 'My Favorites',
  addedAt: new Date().toISOString()
});
```

### Query Firestore

```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';

const q = query(
  collection(db, 'songs'),
  where('userId', '==', userId)
);
const snapshot = await getDocs(q);
const songs = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

### Update User Profile

```javascript
const { updateUserProfile } = useAuth();

await updateUserProfile({
  description: 'Music lover',
  age: 25,
  gender: 'male'
});
```

## 🎯 Common Tasks

### Add a New Translation

Edit `src/contexts/LanguageContext.jsx`:

```javascript
const translations = {
  en: {
    newKey: 'New Text',
    // ...
  },
  es: {
    newKey: 'Nuevo Texto',
    // ...
  }
};
```

### Change Theme Colors

Edit `src/index.css`:

```css
:root {
  --primary-color: #your-color;
}
```

### Add a New Route

Edit `src/App.jsx`:

```javascript
<Route path="/new-page" element={
  <ProtectedRoute>
    <NewPage />
  </ProtectedRoute>
} />
```

### Create New Component

```javascript
import React from 'react';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

## 📱 Component Props Quick Ref

### Layout
```javascript
<Layout>
  {/* children */}
</Layout>
```

### ProtectedRoute
```javascript
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

## 🔥 Firebase Quick Commands

### Initialize
```javascript
import { initializeApp } from 'firebase/app';
const app = initializeApp(firebaseConfig);
```

### Auth
```javascript
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
const auth = getAuth();
const provider = new GoogleAuthProvider();
await signInWithPopup(auth, provider);
```

### Firestore
```javascript
import { getFirestore, collection, doc, getDoc, setDoc } from 'firebase/firestore';
const db = getFirestore();
```

## 🎬 YouTube Quick Commands

### Search
```javascript
const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${API_KEY}`;
const response = await fetch(url);
const data = await response.json();
```

### Player
```javascript
new YT.Player('player-id', {
  videoId: 'abc123',
  events: {
    onReady: (event) => event.target.playVideo(),
    onStateChange: (event) => console.log(event.data)
  }
});
```

## 🐛 Debug Commands

### Check Build
```bash
npm run build 2>&1 | grep -i error
```

### Clear Cache
```bash
rm -rf node_modules package-lock.json dist
npm install
```

### Check Bundle Size
```bash
npm run build
ls -lh dist/assets
```

## 🔍 Useful Browser Console Commands

### Check Service Worker
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Registered:', registrations.length);
});
```

### Check Local Storage
```javascript
console.log(localStorage.getItem('musi-love-language'));
```

### Force Update Service Worker
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.update());
});
```

## 📊 Firebase Console Shortcuts

| Task | Path |
|------|------|
| Authentication | Firebase Console → Authentication |
| Users | Authentication → Users |
| Database | Firestore Database |
| Security Rules | Firestore Database → Rules |
| Usage | Usage and billing |
| Hosting | Hosting |

## 🌐 URLs & Endpoints

### Development
- Local: `http://localhost:5173`

### Firebase
- Console: `https://console.firebase.google.com`
- Project: `https://console.firebase.google.com/project/musi-love`

### Google Cloud
- Console: `https://console.cloud.google.com`
- YouTube API: `https://console.cloud.google.com/apis/library/youtube.googleapis.com`

## 📝 Git Commands

```bash
# Commit
git add .
git commit -m "feat: description"

# Branch
git checkout -b feature/new-feature

# Push
git push origin branch-name

# Pull
git pull origin main
```

## 🎨 CSS Classes Quick Ref

### Layout
- `.page-container` - Page wrapper
- `.card` - Card component
- `.flex`, `.flex-center`, `.flex-between` - Flexbox
- `.grid`, `.grid-2`, `.grid-3` - Grid layouts

### Components
- `.button`, `.button-primary`, `.button-secondary` - Buttons
- `.input`, `.textarea`, `.select` - Form inputs
- `.avatar`, `.avatar-large`, `.avatar-small` - Profile images
- `.badge`, `.badge-primary` - Badges

### Spacing
- `.mt-1`, `.mt-2`, `.mt-3`, `.mt-4` - Margin top
- `.mb-1`, `.mb-2`, `.mb-3`, `.mb-4` - Margin bottom
- `.gap-1`, `.gap-2`, `.gap-3` - Gap

## 🎯 Keyboard Shortcuts

### VS Code
- `Ctrl/Cmd + P` - Quick file open
- `Ctrl/Cmd + Shift + P` - Command palette
- `Ctrl/Cmd + B` - Toggle sidebar
- `Ctrl/Cmd + /` - Toggle comment

### Browser DevTools
- `F12` or `Ctrl/Cmd + Shift + I` - Open DevTools
- `Ctrl/Cmd + Shift + M` - Toggle mobile view
- `Ctrl/Cmd + Shift + C` - Element inspector

## 📞 Need Help?

| Resource | Link |
|----------|------|
| Main Docs | README.md |
| Setup Guide | SETUP_GUIDE.md |
| API Guide | API_GUIDE.md |
| Deployment | DEPLOYMENT_CHECKLIST.md |
| Project Info | PROJECT_SUMMARY.md |

---

**Print this page for quick reference! 📄**
