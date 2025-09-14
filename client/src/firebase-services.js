// src/firebase-services.js

// This file encapsulates all Firebase interaction logic, achieving high cohesion.

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

// -----------------------------------------------------------------------------
// Firebase Configuration and Initialization
// -----------------------------------------------------------------------------

// STEP 1: Paste your new Firebase configuration object here
const firebaseConfig = {
  apiKey: "AIzaSyB3fMdR3yl4LYhWxm_MTxQKCS1z3jBQ8KU",
  authDomain: "couple-70fcb.firebaseapp.com",
  projectId: "couple-70fcb",
  storageBucket: "couple-70fcb.appspot.com", // Corrected from .firebasestorage.app
  messagingSenderId: "401573289329",
  appId: "1:401573289329:web:18adc8905c8bebf60d2ad0",
  measurementId: "G-2MFESTWG9D"
};

// STEP 2: Define appId for your database paths using the projectId
const appId = firebaseConfig.projectId;

const initialAuthToken = undefined;

// Initialize Firebase (This part stays the same)
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


// -----------------------------------------------------------------------------
// Authentication Functions
// -----------------------------------------------------------------------------
export const authenticateUser = async () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        resolve(currentUser);
      } else {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
          } else {
            await signInAnonymously(auth);
          }
          resolve(auth.currentUser);
        } catch (error) {
          console.error("Authentication failed:", error);
          resolve(null);
        }
      }
      unsubscribe();
    });
  });
};

export const logout = () => signOut(auth);

// -----------------------------------------------------------------------------
// Firestore Database Operations
// -----------------------------------------------------------------------------
// const getCollectionPath = (collectionName) => {
//   return `artifacts/${appId}/public/data/${collectionName}`;
// };

// export const subscribeToPhotos = (callback) => {
//   const q = query(collection(db, getCollectionPath('photos')), orderBy('createdAt', 'desc'));
//   return onSnapshot(q, (snapshot) => {
//     const fetchedPhotos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     callback(fetchedPhotos);
//   });
// };

// export const subscribeToRestaurants = (callback) => {
//   const q = query(collection(db, getCollectionPath('restaurants')), orderBy('visitedAt', 'desc'));
//   return onSnapshot(q, (snapshot) => {
//     const fetchedRestaurants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     callback(fetchedRestaurants);
//   });
// };

// export const addPhoto = (photoData, userId, userDisplayName) => {
//   const photoRef = collection(db, getCollectionPath('photos'));
//   return addDoc(photoRef, {
//     imageUrl: photoData.imageUrl,
//     caption: photoData.caption,
//     authorId: userId,
//     author: userDisplayName || '匿名用户',
//     createdAt: new Date(),
//   });
// };

// export const addRestaurant = (restaurantData, userId, userDisplayName) => {
//   const restaurantRef = collection(db, getCollectionPath('restaurants'));
//   return addDoc(restaurantRef, {
//     name: restaurantData.name,
//     location: restaurantData.location,
//     visitedAt: restaurantData.visitedAt ? new Date(restaurantData.visitedAt) : new Date(),
//     notes: restaurantData.notes,
//     authorId: userId,
//     author: userDisplayName || '匿名用户',
//     createdAt: new Date(),
//   });
// };
