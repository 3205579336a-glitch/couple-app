// 文件路径: src/pages/HomePage.js (重构后)

import React, { useState, useEffect } from 'react';
import { Spin, Typography, Card, Row, Col, Statistic } from 'antd';
import { CameraOutlined, ShopOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const API_BASE_URL = '/api';

const HomePage = ({ user }) => {
  const [stats, setStats] = useState({ photoCount: 0, restaurantCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 并发请求照片和餐厅数据，速度更快
        const [photosResponse, restaurantsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/photos`),
          fetch(`${API_BASE_URL}/restaurants`) // 确保你已在 api 目录中创建了 restaurants.js
        ]);

        const photos = await photosResponse.json();
        const restaurants = await restaurantsResponse.json();

        setStats({
          photoCount: photos.length,
          restaurantCount: restaurants.length
        });
        
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin tip="加载主页数据中..." size="large" />
      </div>
    );
  }

  return (
    <div>
      <Card style={{ marginBottom: '24px' }}>
        <Title level={2}>欢迎回来！</Title>
        <Paragraph>
          这里是你们共同的回忆空间。继续记录每一个值得珍藏的瞬间吧！
        </Paragraph>
      </Card>
      
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic
              title="已记录的照片回忆"
              value={stats.photoCount}
              prefix={<CameraOutlined />}
              suffix="张"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="一起光顾的美食店"
              value={stats.restaurantCount}
              prefix={<ShopOutlined />}
              suffix="家"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;