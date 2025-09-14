// server/index.js

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- INITIALIZATION ---
const app = express();
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const port = 3001; // Port for our server

// --- MIDDLEWARE ---
app.use(cors()); // Allow requests from our React app
app.use(express.json()); // Allow the server to understand JSON request bodies

// --- API ENDPOINTS (ROUTES) ---

// GET all photos
app.get('/api/photos', async (req, res) => {
  try {
    const photosRef = db.collection('photos');
    const snapshot = await photosRef.orderBy('createdAt', 'desc').get();
    
    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const photos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(photos);
  } catch (error) {
    console.error("Error getting photos:", error);
    res.status(500).send("Error fetching photos");
  }
});

// POST (add) a new photo
app.post('/api/photos', async (req, res) => {
  try {
    const { imageUrl, caption, authorId, author } = req.body;

    // Basic validation
    if (!imageUrl || !caption) {
      return res.status(400).send("Image URL and caption are required.");
    }

    const newPhoto = {
      imageUrl,
      caption,
      authorId: authorId || 'unknown',
      author: author || '匿名用户',
      createdAt: new Date(),
    };

    const docRef = await db.collection('photos').add(newPhoto);
    res.status(201).json({ id: docRef.id, ...newPhoto });
  } catch (error) {
    console.error("Error adding photo:", error);
    res.status(500).send("Error adding photo");
  }
});

// TODO: You can add more endpoints for restaurants, deleting, and updating in the same way.
// GET /api/restaurants
// POST /api/restaurants
// DELETE /api/photos/:id
// PUT /api/photos/:id

// --- START SERVER ---
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});