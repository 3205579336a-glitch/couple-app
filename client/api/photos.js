// 文件路径: client/api/photos.js
// 注意：这里的代码写法和 Express 略有不同，但更简洁。

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 使用 Vercel 的环境变量来安全地存储密钥
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 处理 GET 请求
    const photosRef = db.collection('photos');
    const snapshot = await photosRef.orderBy('createdAt', 'desc').get();
    const photos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(photos);
  } else if (req.method === 'POST') {
    // 处理 POST 请求
    const newPhoto = req.body;
    const docRef = await db.collection('photos').add(newPhoto);
    res.status(201).json({ id: docRef.id, ...newPhoto });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}