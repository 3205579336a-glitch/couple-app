// 文件路径: client/api/photos.js

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 从 Vercel 的环境变量中安全地读取服务账户密钥
// 你需要在 Vercel 项目的设置中添加这个环境变量
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');

// 初始化 Firebase Admin SDK (确保只初始化一次)
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

// 这是 Vercel Serverless Function 的标准写法
export default async function handler(req, res) {
  const getCollectionPath = () => `artifacts/couple-70fcb/public/data/photos`;

  // 根据请求方法 (GET, POST 等) 分别处理
  if (req.method === 'GET') {
    try {
      const photosRef = db.collection(getCollectionPath());
      const snapshot = await photosRef.orderBy('createdAt', 'desc').get();
      const photos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(photos);
    } catch (error) {
      console.error("Error getting photos:", error);
      return res.status(500).json({ error: 'Error fetching photos' });
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const newPhotoData = req.body;
      if (!newPhotoData.imageUrl || !newPhotoData.caption) {
        return res.status(400).json({ error: 'Image URL and caption are required.' });
      }
      
      const docRef = await db.collection(getCollectionPath()).add({
        ...newPhotoData,
        createdAt: new Date(),
      });
      return res.status(201).json({ id: docRef.id, ...newPhotoData });
    } catch (error) {
      console.error("Error adding photo:", error);
      return res.status(500).json({ error: 'Error adding photo' });
    }
  } 
  
  // 如果是其他方法 (如 PUT, DELETE), 则返回不允许
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}