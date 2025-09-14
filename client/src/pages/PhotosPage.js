// 文件路径: src/pages/PhotosPage.js (重构后)
import React, { useState, useEffect } from 'react';
import { Spin, List, Card } from 'antd';
import AddPhotoForm from '../components/AddPhotoForm'; // 假设你的表单组件在这里

// 注意：现在我们调用自己的相对路径 API, 而不是外部服务器
const API_BASE_URL = '/api';

const PhotosPage = ({ user }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 从我们自己的 Vercel API 获取照片
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/photos`);
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error("获取照片失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  // 通过向我们自己的 Vercel API 发送 POST 请求来添加照片
  const handleAddPhoto = async (photoData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 我们在表单组件里已经准备好了 authorId 和 author
        body: JSON.stringify(photoData),
      });
      const newPhoto = await response.json();
      setPhotos([newPhoto, ...photos]); // 实时更新界面
    } catch (error) {
      console.error("添加照片失败:", error);
    }
  };

  if (loading) {
    return <Spin tip="加载照片中..." />;
  }

  return (
    <div>
      <AddPhotoForm onAdd={handleAddPhoto} user={user} />
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
        dataSource={photos}
        renderItem={(photo) => (
          <List.Item>
            <Card
              cover={<img alt={photo.caption} src={photo.imageUrl} style={{ height: 200, objectFit: 'cover' }} />}
            >
              <Card.Meta title={photo.caption} description={`由 ${photo.author} 添加`} />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default PhotosPage;