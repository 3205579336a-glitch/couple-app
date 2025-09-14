// src/pages/HomePage.js (EXAMPLE of fetching data)

import React, { useState, useEffect } from 'react';
import { Spin, List, Card, Button } from 'antd';

const API_URL = 'http://localhost:3001/api'; // Your server URL

const HomePage = ({ user }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch photos from the server when the component mounts
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/photos`);
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error("Failed to fetch photos from server:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Function to add a new photo by sending data to the server
  const handleAddPhoto = async (photoData) => {
    try {
      const response = await fetch(`${API_URL}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...photoData,
          authorId: user.uid,
          author: user.displayName || '匿名用户',
        }),
      });
      const newPhoto = await response.json();
      // Add the new photo to the top of the list to update the UI
      setPhotos([newPhoto, ...photos]);
    } catch (error) {
      console.error("Failed to add photo:", error);
    }
  };

  if (loading) {
    return <Spin tip="加载回忆中..." size="large" />;
  }

  return (
    <div>
      {/* You would have a form that calls handleAddPhoto on submit */}
      {/* <AddPhotoForm onAdd={handleAddPhoto} /> */}

      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={photos}
        renderItem={(photo) => (
          <List.Item>
            <Card title={photo.caption}>
              <img alt={photo.caption} src={photo.imageUrl} style={{ width: '100%' }} />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default HomePage;