# Player Data Folder

This folder is reserved for player registration data files.

## Architecture
- **Frontend**: Loads characters from `/player-data/*.json` files in this folder
- **Backend**: Node.js server that receives character data and writes files to GitHub API
- **GitHub**: Hosts both the frontend and the player data files

## Setup Instructions

1. **Create GitHub Personal Access Token**
   - Go to https://github.com/settings/tokens
   - Create token with `repo` scope
   - Copy the token

2. **Configure Backend** (see `BACKEND_SETUP.md`)
   ```bash
   cp .env.example .env
   # Edit .env and add your GITHUB_TOKEN
   npm install
   npm start
   ```

3. **Frontend Connection**
   - Frontend automatically connects to `http://localhost:3000`
   - Or set custom URL in browser: `localStorage.setItem('backendApiUrl', 'http://your-server:3000')`

## How It Works

1. **New Player Registration**
   - Player enters ID → Frontend sends to backend
   - Backend receives and validates
   - Backend writes to `player-data/{id}.json` via GitHub API
   - File appears in this folder within seconds

2. **Player Login**
   - Frontend fetches from `player-data/{id}.json`
   - Can work offline if files are cached

3. **Data Updates** (if backend saves enabled)
   - Frontend sends updates to backend
   - Backend updates file in GitHub
