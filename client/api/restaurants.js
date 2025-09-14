// 文件路径: client/api/restaurants.js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const getCollectionPath = () => `artifacts/couple-70fcb/public/data/restaurants`;

  if (req.method === 'GET') {
    // ... (此处省略 GET 逻辑, 请参考 photos.js 自行添加) ...
  }
  else if (req.method === 'POST') {
    // ... (此处省略 POST 逻辑, 请参考 photos.js 自行添加) ...
  }
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}