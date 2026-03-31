# 🚀 LearnSync - Deploy to Vercel with PWA

## Quick Deploy (5 minutes)

### 1. Generate PWA Icons
```bash
# Open generate-icons.html in browser
# Download icon-192.png and icon-512.png
# Move them to public/ folder
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Deploy with PWA"
git push origin main
```

### 3. Deploy on Vercel
1. Go to https://vercel.com
2. Click "New Project" → Import your repo
3. Add environment variables (from .env):
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID
   - VITE_GEMINI_API_KEY
4. Click "Deploy"

### 4. Test
- Open Vercel URL on mobile
- Install as PWA
- Test voice features

## That's It! 🎉

Your app is live with PWA, offline mode, and voice AI tutor.

## Troubleshooting

**Build fails?** Run `npm run build` locally first
**PWA not working?** Clear cache, check HTTPS
**Voice not working?** Allow mic permissions, use Chrome/Edge
