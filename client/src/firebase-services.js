// 文件路径: src/firebase-services.js (重构后)
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth';

// 你的客户端 Firebase 配置 (不是服务账户密钥!)
const firebaseConfig = {
  apiKey: "AIzaSyB3fMdR3yl4LYhWxm_MTxQKCS1z3jBQ8KU",
  authDomain: "couple-70fcb.firebaseapp.com",
  projectId: "couple-70fcb",
  storageBucket: "couple-70fcb.appspot.com",
  messagingSenderId: "401573289329",
  appId: "1:401573289329:web:18adc8905c8bebf60d2ad0",
  measurementId: "G-2MFESTWG9D"
};

// 初始化 Firebase 应用
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 用户认证函数 (这部分保持不变)
export const authenticateUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        resolve(user);
      } else {
        try {
          await signInAnonymously(auth);
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

// --- 所有 Firestore 数据库相关的函数都已移除 ---