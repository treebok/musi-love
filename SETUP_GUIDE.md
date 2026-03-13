# 🚀 Quick Setup Guide for Musi-Love

This guide will walk you through setting up Musi-Love step by step.

## Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will install all required packages including React, Firebase, and Vite.

## Step 2: Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Click on "Enable APIs and Services"
4. Search for "YouTube Data API v3"
5. Click "Enable"
6. Go to "Credentials" in the sidebar
7. Click "Create Credentials" → "API Key"
8. Copy the API key

**Important:** For production, restrict your API key:
- Application restrictions: HTTP referrers
- Add your domain: `https://yourdomain.com/*`
- API restrictions: Restrict to YouTube Data API v3

## Step 3: Configure YouTube API Key

Open `src/config.js` and replace the placeholder:

```javascript
// Before
export const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY_HERE';

// After
export const YOUTUBE_API_KEY = 'AIzaSyC...your-actual-key';
```

## Step 4: Set Up Firebase (Already Configured!)

The Firebase configuration is already set up in the project:
- Project ID: `musi-love`
- Authentication: Google OAuth enabled
- Firestore: Database ready

**What you need to do:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Find the "musi-love" project (or it should already be set up)
3. Go to **Authentication** → **Sign-in method**
4. Enable **Google** sign-in provider if not already enabled
5. Go to **Firestore Database** → **Rules**
6. Update security rules (see below)

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Anyone authenticated can read
      allow read: if request.auth != null;
      // Only the user can write their own data
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Songs collection
    match /songs/{songId} {
      // Anyone authenticated can read
      allow read: if request.auth != null;
      // Only owner can create songs
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      // Only owner can update/delete their songs
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Step 5: Generate PWA Icons

The project has placeholder files for icons. Generate proper icons:

### Option A: Using RealFaviconGenerator (Recommended)

1. Go to [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload a logo image (at least 512x512px, square)
3. Customize as needed
4. Generate and download
5. Extract and replace:
   - `public/icon-192.png`
   - `public/icon-512.png`
   - `public/favicon.svg` (optional)

### Option B: Using the Provided SVG

The project includes a basic SVG icon at `public/favicon.svg`. You can:
1. Convert it to PNG using any SVG to PNG converter
2. Generate 192x192 and 512x512 versions
3. Replace the placeholder files

## Step 6: Test Locally

Start the development server:

```bash
npm run dev
```

Open your browser to: `http://localhost:5173`

### Test Checklist:

- [ ] Sign in with Google works
- [ ] Profile can be edited (age, gender, description)
- [ ] YouTube search returns results
- [ ] Songs can be added to playlists
- [ ] Songs can be deleted
- [ ] Users list shows all users
- [ ] Clicking on a user shows their profile
- [ ] Player page plays videos
- [ ] Sequential playback works (next/previous)
- [ ] Language switcher works

## Step 7: Build for Production

When everything works:

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

Test the production build locally:

```bash
npm run preview
```

## Step 8: Deploy

### Option 1: Firebase Hosting (Recommended)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select your project: musi-love
# Public directory: dist
# Single-page app: Yes
# Set up automatic builds: No
firebase deploy
```

### Option 2: Vercel

```bash
npm install -g vercel
vercel login
vercel
# Follow the prompts
```

### Option 3: Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
# Drag the dist folder or use CLI
```

### Option 4: Any Static Hosting

Upload the contents of the `dist/` folder to any static hosting provider:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps

## Common Issues & Solutions

### 🔴 YouTube Search Returns No Results

**Cause:** API key not configured or invalid

**Solution:**
1. Check `src/config.js` has correct API key
2. Verify YouTube Data API v3 is enabled in Google Cloud
3. Check browser console for API errors
4. Ensure API key has no restrictions (for testing)

### 🔴 Can't Sign In with Google

**Cause:** Firebase authentication not configured

**Solution:**
1. Go to Firebase Console → Authentication
2. Enable Google sign-in provider
3. Add your domain to authorized domains (for production)

### 🔴 Songs Not Saving

**Cause:** Firestore security rules too restrictive

**Solution:**
1. Go to Firebase Console → Firestore → Rules
2. Update rules as shown in Step 4
3. Click "Publish"

### 🔴 PWA Not Installing

**Cause:** Missing icons or incorrect manifest

**Solution:**
1. Generate proper icons (Step 5)
2. Replace `public/icon-192.png` and `public/icon-512.png`
3. Test on HTTPS (PWA requires secure context)

### 🔴 "Module not found" Errors

**Cause:** Dependencies not installed

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### 🔴 Build Fails

**Cause:** TypeScript or linting errors

**Solution:**
1. Check console for specific errors
2. Fix any syntax errors in code
3. Try: `npm run build -- --mode development`

## Environment Variables (Optional)

For better security, you can use environment variables:

1. Create `.env` file:
```env
VITE_YOUTUBE_API_KEY=your_api_key_here
```

2. Update `src/config.js`:
```javascript
export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 'YOUR_YOUTUBE_API_KEY_HERE';
```

3. Add `.env` to `.gitignore` (already included)

## Performance Tips

### Optimize Images
- Use WebP format for thumbnails
- Lazy load images
- Cache YouTube thumbnails

### Optimize Bundle
- Code splitting is already enabled via React Router
- Service worker caches assets
- Workbox optimizes caching strategies

### Database Optimization
- Index Firestore on `lastSeen` field for faster user queries
- Consider pagination for large song lists

## Security Checklist

Before deploying to production:

- [ ] Restrict YouTube API key to your domain
- [ ] Update Firestore security rules
- [ ] Enable Firebase App Check (optional but recommended)
- [ ] Add authorized domains in Firebase Console
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS (required for PWA)
- [ ] Review and test authentication flow
- [ ] Add rate limiting to API calls (optional)

## Support & Resources

- **Firebase Docs:** https://firebase.google.com/docs
- **YouTube API Docs:** https://developers.google.com/youtube/v3
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **PWA Guide:** https://web.dev/progressive-web-apps/

## Next Steps

After successful deployment:

1. Test on multiple devices
2. Install as PWA on mobile
3. Share with friends
4. Monitor Firebase usage
5. Check YouTube API quotas
6. Gather user feedback
7. Iterate and improve!

---

**Need Help?** Check the main README.md for more details or open an issue on GitHub.

Good luck! 🎵❤️
