# 🚀 Deployment Checklist for Musi-Love

Use this checklist before deploying to production.

## ⚙️ Pre-Deployment Setup

### 1. YouTube API Configuration
- [ ] Created Google Cloud project
- [ ] Enabled YouTube Data API v3
- [ ] Generated API key
- [ ] Added API key to `src/config.js`
- [ ] Tested YouTube search functionality
- [ ] (Production) Restricted API key to your domain

### 2. Firebase Setup
- [ ] Firebase project created (musi-love)
- [ ] Google OAuth enabled in Firebase Console
- [ ] Firestore database created
- [ ] Firestore security rules updated (see README.md)
- [ ] Tested authentication flow
- [ ] Added authorized domains (production URL)

### 3. PWA Icons
- [ ] Generated 192x192 PNG icon
- [ ] Generated 512x512 PNG icon
- [ ] Replaced placeholder files in `public/`
- [ ] Updated `public/manifest.json` if needed
- [ ] Generated favicon.ico (optional)

### 4. Code Quality
- [ ] No console errors in browser
- [ ] No console warnings
- [ ] All features tested manually
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari (if available)
- [ ] Tested on mobile device
- [ ] Tested PWA installation

## 🔧 Build Process

### 1. Environment Check
```bash
node --version    # Should be 16+
npm --version     # Should be 8+
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build Application
```bash
npm run build
```

- [ ] Build completed without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Build size is reasonable (check dist/ folder)

### 4. Test Production Build
```bash
npm run preview
```

- [ ] Application loads correctly
- [ ] All pages accessible
- [ ] Authentication works
- [ ] YouTube search works
- [ ] Songs can be added/deleted
- [ ] Player functions correctly
- [ ] Language switcher works
- [ ] Responsive design intact
- [ ] PWA can be installed

## 🌐 Deployment

### Option 1: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting
# Select: musi-love
# Public directory: dist
# Single-page app: Yes
# Overwrite index.html: No

# Deploy
firebase deploy --only hosting
```

- [ ] Deployment successful
- [ ] Site URL received
- [ ] Site loads correctly
- [ ] HTTPS enabled (automatic with Firebase)

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Or for production
vercel --prod
```

- [ ] Deployment successful
- [ ] Site URL received
- [ ] Site loads correctly
- [ ] HTTPS enabled (automatic)

### Option 3: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

- [ ] Deployment successful
- [ ] Site URL received
- [ ] Site loads correctly
- [ ] HTTPS enabled (automatic)

### Option 4: Manual Upload

1. Build the project: `npm run build`
2. Upload contents of `dist/` folder to your hosting
3. Configure server for SPA (all routes → index.html)

- [ ] All files uploaded
- [ ] Server configured for SPA
- [ ] Site loads correctly
- [ ] HTTPS configured

## 🔐 Post-Deployment Security

### 1. YouTube API Key
- [ ] Restricted to production domain
- [ ] HTTP referrers configured
- [ ] API restrictions set to YouTube Data API v3

**In Google Cloud Console:**
- Credentials → Your API Key → Edit
- Application restrictions: HTTP referrers
- Add: `https://yourdomain.com/*`
- API restrictions: YouTube Data API v3

### 2. Firebase
- [ ] Authorized domains updated
  - Firebase Console → Authentication → Settings
  - Add your production domain
- [ ] Firestore rules reviewed
- [ ] Firebase App Check enabled (optional but recommended)

### 3. General Security
- [ ] HTTPS enabled (required for PWA)
- [ ] CSP headers configured (optional)
- [ ] Security headers configured (optional)

## ✅ Post-Deployment Testing

### Functionality Tests
- [ ] Homepage loads
- [ ] Google sign-in works
- [ ] Profile can be edited
- [ ] YouTube search returns results
- [ ] Songs can be added
- [ ] Songs can be deleted
- [ ] Playlists can be created
- [ ] Users list loads
- [ ] User profiles viewable
- [ ] Player works
- [ ] Sequential playback works
- [ ] Language switcher functions
- [ ] Logout works

### PWA Tests
- [ ] PWA prompt appears
- [ ] PWA can be installed (desktop)
- [ ] PWA can be installed (mobile)
- [ ] Offline fallback works
- [ ] Service worker registered
- [ ] Assets cached properly

### Mobile Tests
- [ ] Loads on mobile Chrome
- [ ] Loads on mobile Safari
- [ ] Responsive layout correct
- [ ] Touch interactions work
- [ ] Virtual keyboard doesn't break UI
- [ ] Install prompt works (Android)
- [ ] Add to home screen works (iOS)

### Browser Tests
- [ ] Chrome (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Edge (Desktop)
- [ ] Chrome (Mobile)
- [ ] Safari (Mobile)

## 📊 Monitoring Setup (Optional)

### Analytics
- [ ] Google Analytics added
- [ ] Firebase Analytics enabled
- [ ] Conversion tracking set up

### Error Tracking
- [ ] Sentry integrated (optional)
- [ ] Error reporting configured

### Performance
- [ ] Firebase Performance enabled
- [ ] Lighthouse score checked (aim for 90+)

## 🎉 Launch

### Final Checks
- [ ] All checklist items completed
- [ ] Backup created (if applicable)
- [ ] Documentation updated with production URL
- [ ] Team notified
- [ ] Monitoring dashboard checked

### Share Your App
- [ ] Update README.md with production URL
- [ ] Share with team/users
- [ ] Announce on social media
- [ ] Submit to PWA directories (optional)

## 📈 Post-Launch

### Monitor
- [ ] Check Firebase usage (first 24 hours)
- [ ] Check YouTube API quota usage
- [ ] Review error logs
- [ ] Check user feedback

### Optimize
- [ ] Review performance metrics
- [ ] Optimize slow pages
- [ ] Fix any reported bugs
- [ ] Plan next features

---

## 🆘 Troubleshooting

### Build Fails
1. Clear cache: `rm -rf node_modules package-lock.json`
2. Reinstall: `npm install`
3. Try again: `npm run build`

### Deployment Fails
1. Check build completed successfully
2. Verify credentials (Firebase/Vercel/Netlify)
3. Check network connection
4. Review deployment logs

### YouTube Search Not Working
1. Verify API key in production config
2. Check API key restrictions
3. Verify YouTube Data API v3 is enabled
4. Check API quota hasn't been exceeded

### PWA Not Installing
1. Ensure HTTPS is enabled
2. Check manifest.json is accessible
3. Verify icons exist (192x192, 512x512)
4. Check service worker registered
5. Try in incognito/private mode

---

## ✅ Success Criteria

Your deployment is successful when:
- ✅ All users can sign in with Google
- ✅ All features work as expected
- ✅ PWA can be installed
- ✅ Mobile experience is smooth
- ✅ No critical errors in console
- ✅ Site is fast and responsive

---

**Congratulations on deploying Musi-Love! 🎵🎉**

Need help? Check:
- README.md
- SETUP_GUIDE.md
- Firebase documentation
- YouTube API documentation
