
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Demo user
const USER_ID = "demo-user";

// 30 mock profiles
const names = [
  "Aarav", "Priya", "Rohan", "Ananya", "Kabir",
  "Ishita", "Vihaan", "Meera", "Arjun", "Aditi",
  "Reyansh", "Sanya", "Advik", "Kiara", "Dev",
  "Myra", "Ishaan", "Diya", "Krish", "Tara",
  "Neel", "Riya", "Atharv", "Sara", "Yash",
  "Naina", "Aditya", "Simran", "Kunal", "Avni"
];

const bios = [
  "Coffee lover and weekend explorer.",
  "Always looking for new adventures.",
  "Music, books and meaningful conversations.",
  "Foodie who loves discovering new places.",
  "Fitness enthusiast and travel addict."
];

const interests = [
  ["Travel", "Photography", "Music"],
  ["Reading", "Coffee", "Movies"],
  ["Fitness", "Cricket", "Travel"],
  ["Art", "Music", "Food"],
  ["Technology", "Gaming", "Photography"]
];

const cities = [
  "Jamshedpur", "Delhi", "Mumbai", "Bangalore", "Pune",
  "Hyderabad", "Kolkata", "Chennai", "Jaipur", "Lucknow"
];

// These profiles have secretly liked the demo user.
// The frontend will never receive this property.
const profiles = names.map((name, index) => ({
  id: `profile-${index + 1}`,
  name,
  age: 21 + (index % 6),
  photo: `https://randomuser.me/api/portraits/${
    index % 2 === 0 ? "men" : "women"
  }/${index + 1}.jpg`,
  bio: bios[index % bios.length],
  city: cities[index % cities.length],
  college: "College Student",
  interests: interests[index % interests.length],
  likedUser: [1, 4, 8, 12, 17, 23].includes(index)
}));

// Persistent JSON storage
const dataDirectory = path.join(__dirname, "data");
const storePath = path.join(dataDirectory, "store.json");

let store = {
  swipes: [],
  matches: []
};

async function saveStore() {
  await fs.promises.writeFile(
    storePath,
    JSON.stringify(store, null, 2)
  );
}

async function loadStore() {
  await fs.promises.mkdir(dataDirectory, { recursive: true });

  if (fs.existsSync(storePath)) {
    const savedData = await fs.promises.readFile(storePath, "utf8");
    store = JSON.parse(savedData);
  } else {
    await saveStore();
  }
}

// GET /feed
// Return only profiles that have not been swiped on.
// Never expose private incoming likes.
app.get("/feed", (req, res) => {
  const swipedIds = new Set(
    store.swipes
      .filter((swipe) => swipe.userId === USER_ID)
      .map((swipe) => swipe.profileId)
  );

  const feed = profiles
    .filter((profile) => !swipedIds.has(profile.id))
    .map(({ likedUser, ...publicProfile }) => publicProfile);

  res.json({
    success: true,
    count: feed.length,
    profiles: feed
  });
});

// POST /swipe
app.post("/swipe", async (req, res) => {
  try {
    const { profileId, action } = req.body;

    if (!profileId || !["like", "pass"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid profileId and action (like/pass)."
      });
    }

    const profile = profiles.find((p) => p.id === profileId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found."
      });
    }

    const alreadySwiped = store.swipes.some(
      (swipe) =>
        swipe.userId === USER_ID &&
        swipe.profileId === profileId
    );

    if (alreadySwiped) {
      return res.status(409).json({
        success: false,
        message: "You have already swiped on this profile."
      });
    }

    store.swipes.push({
      userId: USER_ID,
      profileId,
      action,
      createdAt: new Date().toISOString()
    });

    let isMatch = false;

    if (action === "like" && profile.likedUser) {
      isMatch = true;

      store.matches.push({
        userId: USER_ID,
        profileId,
        createdAt: new Date().toISOString()
      });
    }

    await saveStore();

    res.json({
      success: true,
      action,
      isMatch,
      message: isMatch ? "It's a match!" : "Swipe saved."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not save swipe."
    });
  }
});

// GET /matches
// Return mutual matches only.
app.get("/matches", (req, res) => {
  const matchedProfiles = store.matches
    .filter((match) => match.userId === USER_ID)
    .map((match) => {
      const profile = profiles.find(
        (p) => p.id === match.profileId
      );

      if (!profile) return null;

      const { likedUser, ...publicProfile } = profile;
      return publicProfile;
    })
    .filter(Boolean);

  res.json({
    success: true,
    count: matchedProfiles.length,
    matches: matchedProfiles
  });
});

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Coy Discover API is running!"
  });
});

// Start server
async function startServer() {
  try {
    await loadStore();

    app.listen(PORT, () => {
      console.log(`Coy Discover API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
