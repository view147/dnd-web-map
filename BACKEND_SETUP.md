# Backend Setup Guide

This guide explains how to set up and run the backend service that securely saves character data to GitHub.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- GitHub Personal Access Token

## Step 1: Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name (e.g., "D&D Web Map")
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click **Generate token**
6. **Copy the token** (you won't see it again!)

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Create .env File

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Then edit `.env`:
```env
GITHUB_TOKEN=your_token_here
GITHUB_OWNER=view147
GITHUB_REPO=dnd-web-map
PORT=3000
```

## Step 4: Run the Server

```bash
npm start
```

You should see:
```
🚀 Server running on http://localhost:3000
GitHub Repo: view147/dnd-web-map
GitHub Token configured: true
```

## Step 5: Update Frontend API URL (if needed)

The frontend looks for the backend at `http://localhost:3000` by default.

To change it, users can set in browser console:
```javascript
localStorage.setItem('backendApiUrl', 'http://your-server:3000');
```

Or modify the default in `characters.html`:
```javascript
const BACKEND_API_URL = 'http://your-server:3000';
```

## Deployment

### Option A: Run on your machine
- Keep the server running locally
- Frontend must be on same network or use `http://your-ip:3000`

### Option B: Deploy to Cloud
Popular options (all have free tiers):

**Heroku** (no longer recommended - free tier removed)

**Render.com**
- Connect GitHub repo
- Set environment variables
- Auto-deploys on git push

**Railway.app**
- Connect GitHub repo
- Set env vars in UI
- Simple deployment

**DigitalOcean App Platform**
- Upload `server.js` and `package.json`
- Set GitHub token in UI

## Test the Backend

Check if backend is running:
```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "online",
  "githubConfigured": true,
  "owner": "view147",
  "repo": "dnd-web-map"
}
```

## API Endpoints

### Save Character
```
POST /api/save-character
Content-Type: application/json

{
  "id": "PlayerName",
  "data": { /* character data object */ }
}
```

### Check Character Exists
```
POST /api/check-character
Content-Type: application/json

{
  "id": "PlayerName"
}
```

Response:
```json
{ "exists": true }
```

## Security Notes

⚠️ **Keep your GitHub token secret!**
- Never commit `.env` file
- Never share token in public repos
- Use `.gitignore` to exclude `.env`

🔒 The backend uses the token server-side only - frontend never sees it.

## Troubleshooting

**"GitHub token not configured"**
- Check `.env` file has `GITHUB_TOKEN=...`
- Restart server after changing `.env`

**"Failed to save character: 401"**
- Token may be invalid or expired
- Generate a new token

**"CORS policy: No 'Access-Control-Allow-Origin' header"**
- Backend CORS is enabled for all origins
- Check backend is running
- Check frontend is calling correct URL

**Files not appearing in GitHub**
- Go to https://github.com/view147/dnd-web-map
- Check `player-data/` folder
- Refresh the page (GitHub UI caches)
