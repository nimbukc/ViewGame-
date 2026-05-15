# ViewGame - Developer Manual 
This document is for future developers who will work on the ViewGame project.

## How to Install
1. Clone the repository from GitHub:
   git clone https://github.com/nimbukc/ViewGame-.git
2. Navigate to the backend folder:
   cd ViewGame-/backend
3. Install all dependencies:
   npm install

## How to Run the Application
1. Navigate to the backend folder: cd backend
2. Start the server: node server.js
3. Open your browser and go to: http://localhost:3000

## API Endpoints
 Method - Endpoint - Description
  GET - /api/favorites - Get all saved favorite teams from Supabase
  POST - /api/favorites - Save a new favorite team to Supabase
  GET - /api/standings - Get Bundesliga standings from OpenLigaDB
  GET - /api/matches - Get recent match results from OpenLigaDB
  GET - /api/teams - Get list of all teams from OpenLigaDB

## Known Bugs
1. ViewGame currently only supports Bundesliga data
2. Some match scores may show tie like 0 - 0 if the match hasn't been played yet or tie the game overall

## Future Development
1. Add support for more leagues
2. Add player statistics page
3. Add ability to delete saved favorites
4. Add match date and time display