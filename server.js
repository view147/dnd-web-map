require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Octokit } = require('@octokit/rest');

const app = express();
const PORT = process.env.PORT || 3000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'view147';
const GITHUB_REPO = process.env.GITHUB_REPO || 'dnd-web-map';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Initialize Octokit
const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

/**
 * POST /api/save-character
 * Saves character data to GitHub repository
 * Body: { id: string, data: object }
 */
app.post('/api/save-character', async (req, res) => {
  try {
    const { id, data } = req.body;

    if (!id || !data) {
      return res.status(400).json({ error: 'Missing id or data in request body' });
    }

    if (!GITHUB_TOKEN) {
      return res.status(500).json({ error: 'GitHub token not configured on server' });
    }

    const fileName = `player-data/${encodeURIComponent(id)}.json`;
    const fileContent = JSON.stringify(data, null, 2);
    const encodedContent = Buffer.from(fileContent).toString('base64');

    console.log(`Attempting to save character ${id} to GitHub...`);

    // First, try to get the file SHA if it already exists
    let fileSha = null;
    try {
      const existingFile = await octokit.rest.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: fileName
      });
      fileSha = existingFile.data.sha;
    } catch (err) {
      if (err.status !== 404) {
        throw err;
      }
      // File doesn't exist yet, that's fine
    }

    // Create or update the file
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: fileName,
      message: `Save character ${id}`,
      content: encodedContent,
      sha: fileSha
    });

    console.log(`✅ Character ${id} saved successfully`);
    res.json({
      success: true,
      message: `Character ${id} saved successfully`,
      file: response.data.content.path
    });
  } catch (error) {
    console.error('❌ Error saving character:', error.message);
    res.status(500).json({
      error: `Failed to save character: ${error.message}`
    });
  }
});

/**
 * POST /api/check-character
 * Checks if a character exists in the repository
 * Body: { id: string }
 */
app.post('/api/check-character', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing id in request body' });
    }

    if (!GITHUB_TOKEN) {
      return res.status(500).json({ error: 'GitHub token not configured on server' });
    }

    const fileName = `player-data/${encodeURIComponent(id)}.json`;

    try {
      await octokit.rest.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: fileName
      });
      res.json({ exists: true });
    } catch (err) {
      if (err.status === 404) {
        res.json({ exists: false });
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error('❌ Error checking character:', error.message);
    res.status(500).json({
      error: `Failed to check character: ${error.message}`
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    githubConfigured: !!GITHUB_TOKEN,
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO
  });
});

/**
 * Serve static files
 */
app.use(express.static('.'));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`GitHub Repo: ${GITHUB_OWNER}/${GITHUB_REPO}`);
  console.log(`GitHub Token configured: ${!!GITHUB_TOKEN}`);
});
