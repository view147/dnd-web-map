# Player Data Folder

This folder is reserved for player registration data files.

## Notes
- The current app now loads character data from JSON files in this folder.
- To save new player IDs back to GitHub, the browser app must use a GitHub API token or a backend service.
- Set `GITHUB_API_TOKEN` in `characters.html` only when you understand the security implications; do not commit a private token to a public repository.
- Use this folder for manual JSON backups or for future server-side integration.
