
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  X,
  Home,
  Compass,
  MessageCircle,
  MapPin,
  Sparkles,
  RotateCcw
} from "lucide-react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [tab, setTab] = useState("discover");
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [matchProfile, setMatchProfile] = useState(null);
  const [error, setError] = useState("");

  const currentProfile = profiles[0];

  // Load profiles from backend
  const loadFeed = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API}/feed`);
      setProfiles(response.data.profiles);
    } catch (err) {
      setError("Could not connect to the server. Please check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Load mutual matches
  const loadMatches = async () => {
    try {
      const response = await axios.get(`${API}/matches`);
      setMatches(response.data.matches);
    } catch (err) {
      setError("Could not load matches.");
    }
  };

  useEffect(() => {
    loadFeed();
    loadMatches();
  }, []);

  // Like or pass a profile
  const handleSwipe = async (action) => {
    if (!currentProfile || busy) return;

    setBusy(true);
    const selectedProfile = currentProfile;

    try {
      const response = await axios.post(`${API}/swipe`, {
        profileId: selectedProfile.id,
        action
      });

      setProfiles((previous) =>
        previous.filter((profile) => profile.id !== selectedProfile.id)
      );

      if (response.data.isMatch) {
        setMatchProfile(selectedProfile);
        await loadMatches();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Swipe could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  // Handle mobile drag gestures
  const handleDragEnd = (_, info) => {
    if (info.offset.x > 100) {
      handleSwipe("like");
    } else if (info.offset.x < -100) {
      handleSwipe("pass");
    }
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <Heart size={22} fill="white" />
          </div>
          <span>coy<span className="brand-dot">.</span></span>
        </div>

        <nav className="desktop-nav">
          <button
            className={tab === "home" ? "nav-link active" : "nav-link"}
            onClick={() => setTab("home")}
          >
            <Home size={18} /> Home
          </button>

          <button
            className={tab === "discover" ? "nav-link active" : "nav-link"}
            onClick={() => setTab("discover")}
          >
            <Compass size={18} /> Discover
          </button>

          <button
            className={tab === "matches" ? "nav-link active" : "nav-link"}
            onClick={() => {
              setTab("matches");
              loadMatches();
            }}
          >
            <MessageCircle size={18} /> Matches
            {matches.length > 0 && (
              <span className="match-count">{matches.length}</span>
            )}
          </button>
        </nav>

        <div className="user-avatar">A</div>
      </header>

      <main className="main-content">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError("")}>×</button>
          </div>
        )}

        {tab === "home" && (
          <section className="placeholder">
            <Sparkles size={40} />
            <h1>Welcome to Coy</h1>
            <p>Your space for meaningful connections.</p>
            <button
              className="primary-button"
              onClick={() => setTab("discover")}
            >
              Explore Discover
            </button>
          </section>
        )}

        {tab === "discover" && (
          <section className="discover-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">YOUR NEXT CONNECTION</p>
                <h1>Discover</h1>
                <p className="subtitle">
                  Meet people who share your interests.
                </p>
              </div>
              <div className="profile-counter">
                {profiles.length} profiles left
              </div>
            </div>

            <div className="card-area">
              {loading ? (
                <div className="empty-state">
                  <div className="loader"></div>
                  <p>Finding people for you...</p>
                </div>
              ) : currentProfile ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentProfile.id}
                      className="profile-card"
                      drag={!busy ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.8}
                      onDragEnd={handleDragEnd}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
                      exit={{
                        opacity: 0,
                        x: 250,
                        rotate: 15,
                        transition: { duration: 0.25 }
                      }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="photo-container">
                        <img
                          src={currentProfile.photo}
                          alt={currentProfile.name}
                          onError={(event) => {
                            event.currentTarget.src =
                              "https://placehold.co/600x800/ece8f5/594b80?text=Coy+Profile";
                          }}
                        />

                        <div className="photo-overlay"></div>

                        <div className="photo-details">
                          <div className="verified">
                            <Sparkles size={13} /> Discover
                          </div>

                          <h2>
                            {currentProfile.name}, {currentProfile.age}
                          </h2>

                          <p className="location">
                            <MapPin size={15} />
                            {currentProfile.city}
                          </p>
                        </div>
                      </div>

                      <div className="profile-info">
                        <p className="bio">{currentProfile.bio}</p>

                        <p className="college">
                          {currentProfile.college}
                        </p>

                        <div className="interests">
                          {currentProfile.interests.map((interest) => (
                            <span key={interest}>{interest}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="swipe-actions">
                    <button
                      className="action-button pass-button"
                      disabled={busy}
                      onClick={() => handleSwipe("pass")}
                      aria-label="Pass"
                    >
                      <X size={27} />
                    </button>

                    <button
                      className="action-button like-button"
                      disabled={busy}
                      onClick={() => handleSwipe("like")}
                      aria-label="Like"
                    >
                      <Heart size={27} fill="white" />
                    </button>
                  </div>

                  <p className="swipe-hint">
                    <RotateCcw size={14} />
                    Swipe right to like · Left to pass
                  </p>
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Heart size={35} />
                  </div>
                  <h2>You've seen everyone!</h2>
                  <p>There are no more profiles to discover right now.</p>
                  <button className="primary-button" onClick={loadFeed}>
                    Refresh feed
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {tab === "matches" && (
          <section className="matches-section">
            <p className="eyebrow">YOUR CONNECTIONS</p>
            <h1>Matches</h1>
            <p className="subtitle">
              Your mutual likes, all in one place.
            </p>

            {matches.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Heart size={35} />
                </div>
                <h2>No matches yet</h2>
                <p>
                  Keep discovering. When someone you like likes you back,
                  you'll find them here.
                </p>
                <button
                  className="primary-button"
                  onClick={() => setTab("discover")}
                >
                  Discover people
                </button>
              </div>
            ) : (
              <div className="matches-grid">
                {matches.map((person) => (
                  <div className="match-card" key={person.id}>
                    <img src={person.photo} alt={person.name} />
                    <div>
                      <h3>{person.name}, {person.age}</h3>
                      <p>{person.city}</p>
                    </div>
                    <Heart size={19} fill="#ed6585" color="#ed6585" />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="bottom-nav">
        <button
          className={tab === "home" ? "bottom-link active" : "bottom-link"}
          onClick={() => setTab("home")}
        >
          <Home size={21} />
          <span>Home</span>
        </button>

        <button
          className={tab === "discover" ? "bottom-link active" : "bottom-link"}
          onClick={() => setTab("discover")}
        >
          <Compass size={21} />
          <span>Discover</span>
        </button>

        <button
          className={tab === "matches" ? "bottom-link active" : "bottom-link"}
          onClick={() => {
            setTab("matches");
            loadMatches();
          }}
        >
          <MessageCircle size={21} />
          <span>Matches</span>
        </button>
      </footer>

      {/* Match celebration */}
      <AnimatePresence>
        {matchProfile && (
          <motion.div
            className="match-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="match-content"
              initial={{ scale: 0.7, y: 30 }}
              animate={{ scale: 1, y: 0 }}
            >
              <Sparkles size={35} className="match-sparkle" />
              <p className="eyebrow">SOMETHING SPECIAL</p>
              <h1>It's a Match!</h1>
              <p>You and {matchProfile.name} liked each other.</p>

              <img src={matchProfile.photo} alt={matchProfile.name} />

              <button
                className="primary-button"
                onClick={() => {
                  setMatchProfile(null);
                  setTab("matches");
                  loadMatches();
                }}
              >
                View your matches
              </button>

              <button
                className="close-match"
                onClick={() => setMatchProfile(null)}
              >
                Keep discovering
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
