// src/pages/RestaurantsPage.js

import React, { useState, useEffect } from 'react';
import { Spin, List, Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;
const API_URL = 'http://localhost:3001/api'; // Your backend server URL

const RestaurantsPage = ({ user }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        // Make sure you have created the GET /api/restaurants endpoint on your server!
        const response = await fetch(`${API_URL}/restaurants`);
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return <Spin tip="加载美食记录中..." size="large" />;
  }

  return (
    <div>
      <Title level={2}>我们的美食足迹</Title>
      <Paragraph>记录下每一处与美味相遇的地方。</Paragraph>
      {/* TODO: Add a form component here to add new restaurants */}

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
        dataSource={restaurants}
        renderItem={(restaurant) => (
          <List.Item>
            <Card title={restaurant.name}>
              <p><strong>地点:</strong> {restaurant.location}</p>
              <p><strong>光顾于:</strong> {new Date(restaurant.visitedAt).toLocaleDateString()}</p>
              <p><strong>笔记:</strong> {restaurant.notes}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default RestaurantsPage;