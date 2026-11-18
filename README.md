## About the Developer

Ayush Srivastav
B.Tech from 
National Institute of Technology, Jamshedpur

- Email: ayushsrivastav6391.com
- GitHub:[AyushSrivastav833](https://github.com/AyushSrivastav833)
- LinkedIn: https://www.linkedin.com/in/ayush-srivastav-b654b0286/



# Coy Discover – Swipe & Match Application

A mobile-first profile discovery application inspired by Coy, built using React and Node.js. Users can discover profiles, like or pass on them, and view mutual matches.

## Live Demo

- Frontend: https://coy-discover-beta.vercel.app
- Backend API: https://coy-discover-api-ynml.onrender.com

## GitHub Repository

https://github.com/AyushSrivastav833/coy-discover

## Features

- **Discover Profiles:** Browse 30 seeded mock profiles.
- **Swipe Interaction:** Like or pass profiles using swipe gestures or action buttons.
- **Mutual Matching:** A match is created only when both users have liked each other.
- **Matches Dashboard:** View mutual matches in one place.
- **Persistent Data:** Swipe history and matches are saved in a JSON file and retained across server restarts.
- **No Repeated Profiles:** Previously swiped profiles do not appear again.
- **Responsive UI:** Mobile-first interface with desktop support.
- **Empty State:** Displays a message when all profiles have been viewed.

## Tech Stack

### Frontend
- React.js
- Vite
- Axios
- Framer Motion
- Lucide React
- CSS

### Backend
- Node.js
- Express.js
- CORS
- JSON file-based persistence

## Project Structure

```text
coy-discover/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── data/
│   │   └── store.json
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Architecture

The application follows a simple client-server architecture.

1. The React frontend requests profiles from the Express backend.
2. The backend filters out profiles that the demo user has already swiped on.
3. When the user likes or passes a profile, the frontend sends a POST request.
4. The backend records the swipe in `server/data/store.json`.
5. A mutual match is created only if the user likes a profile that has already liked the demo user.
6. The Matches page retrieves and displays only mutual matches.

## API Documentation

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend health check |
| GET | `/feed` | Get profiles not yet swiped on |
| POST | `/swipe` | Record a like or pass |
| GET | `/matches` | Retrieve mutual matches |

### POST /swipe

Example request:

```json
{
  "profileId": "profile-2",
  "action": "like"
}
```

Possible actions:
- `like`
- `pass`

The response includes whether a mutual match was created.

## Installation & Setup

### Prerequisites

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/AyushSrivastav833/coy-discover.git
cd coy-discover
```

### 2. Start the backend

```bash
cd server
npm install
npm run dev
```

The backend runs at:

`http://localhost:5000`

### 3. Start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local Vite URL shown in your terminal, usually:

`http://localhost:5173`

## Data Persistence

Swipe records and mutual matches are stored in:

`server/data/store.json`

This allows the application to retain user actions across page refreshes and backend restarts.

The project uses a single demo user and mock profile data. It does not implement external authentication.

## Future Improvements

- User authentication and individual user accounts.
- Database integration with MongoDB.
- Profile filters based on interests and location.
- Improved profile recommendations.
- Real-time match notifications.
- Profile management and editing.



Built as part of the Coy SDE Intern Assignment.
