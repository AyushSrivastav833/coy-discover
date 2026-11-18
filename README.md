## About the Developer

Ayush Srivastav
B.Tech from 
National Institute of Technology, Jamshedpur

- Email: ayushsrivastav6391.com
- GitHub:[AyushSrivastav833](https://github.com/AyushSrivastav833)
- LinkedIn: https://www.linkedin.com/in/ayush-srivastav-b654b0286/



# Coy Discover — Swipe-Based Dating Discovery App

A standalone swipe-based discovery application inspired by modern dating platforms. Users can discover profiles, like or pass on people, and connect through mutual likes.

## Features

### 1. Profile Discovery
- 30 seeded mock user profiles.
- Each profile includes name, age, photo, bio, city, college, and interests.
- One profile displayed at a time.
- Previously swiped profiles are excluded from the feed.

### 2. Swipe Experience
- Swipe right to like a profile.
- Swipe left to pass on a profile.
- Drag gestures supported through the frontend.
- Like and pass buttons for desktop users.
- Animated profile transitions and feedback.
- Empty state when no profiles remain.

### 3. Mutual Matching
- A match is created only when both users have liked each other.
- Displays an "It's a match!" interaction.
- Dedicated Matches section.
- Only mutual matches are displayed.
- Incoming non-mutual likes are never exposed through the feed or matches API.

### 4. Persistent Storage
- Swipes and matches are stored in a JSON file.
- Data remains available after page refreshes and backend restarts.
- Duplicate swipes are rejected.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite |
| Styling | CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Middleware | CORS |
| Storage | JSON file |

## Project Structure

```text
coy-discover/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── data/
│   │   └── store.json
│   ├── index.js
│   └── package.json
│
└── README.md
```

## Application Architecture

The application follows a simple client-server architecture.

1. React frontend requests profile data from the Express backend.
2. Express retrieves available profiles from the seeded mock data.
3. Users like or pass on profiles.
4. The frontend sends swipe actions to the backend.
5. The backend checks whether the action creates a mutual match.
6. Swipes and matches are saved in the JSON storage file.
7. The Matches page retrieves confirmed mutual matches.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend health check |
| GET | `/feed` | Returns profiles not yet swiped on |
| POST | `/swipe` | Records a like or pass |
| GET | `/matches` | Returns mutual matches |

### POST /swipe

Example request:

```json
{
  "profileId": "profile-1",
  "action": "like"
}
```

Possible actions:
- `like`
- `pass`

The API responds with the swipe result and whether a match was created.

## Installation and Setup

### Prerequisites
- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd coy-discover
```

### 2. Start the backend

```bash
cd server
npm install
npm run dev
```

Backend runs at:

`http://localhost:5000`

### 3. Start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## Testing

The following behaviors have been manually checked:

- Duplicate swipe rejection.
- Previously swiped profiles excluded from the feed.
- Mutual matches displayed in the Matches section.
- Match data persists after backend restart.

## Design Decisions

- **JSON storage:** Chosen for simplicity because this assignment uses a single demo user and a small dataset.
- **Mutual matching:** Prevents revealing incoming likes unless both users have liked each other.
- **Persistent swipes:** Prevents profiles from reappearing after refreshing the application.
- **Single-user model:** External authentication is unnecessary for this assignment.

## Future Improvements

- Replace JSON storage with MongoDB or PostgreSQL.
- Add automated backend tests.
- Add profile filters based on interests and location.
- Improve accessibility and swipe feedback.
- Deploy the frontend and backend.

## Disclaimer

This is an independent assignment project built with mock profile data. It is not affiliated with or connected to Coy's production codebase.