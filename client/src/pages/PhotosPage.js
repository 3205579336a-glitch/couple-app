// src/pages/PhotosPage.js
import React, { useState, useEffect } from 'react';
import { Spin, List, Card } from 'antd';
import AddPhotoForm from '../components/AddPhotoForm'; // 引入表单组件

const API_URL = 'http://localhost:3001/api'; // 你的后端服务器地址

const PhotosPage = ({ user }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 从后端获取照片列表
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/photos`);
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

  // 处理添加照片的逻辑
  const handleAddPhoto = async (photoData) => {
    try {
      const response = await fetch(`${API_URL}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photoData),
      });
      const newPhoto = await response.json();
      setPhotos([newPhoto, ...photos]); // 将新照片添加到列表的最前面
    } catch (error) {
      console.error("添加照片失败:", error);
    }
  };

  if (loading) {
    return <Spin tip="加载照片中..." />;
  }

  return (
    <div>
      {/* 在页面顶部放置添加照片的表单 */}
      <AddPhotoForm onAdd={handleAddPhoto} user={user} />

      {/* 下方是照片列表 */}
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