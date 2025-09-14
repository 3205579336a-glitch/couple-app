// src/App.js (改造后)

import React, { useState, useEffect } from 'react';
// 1. 从 react-router-dom 引入 Routes 和 Route
import { Routes, Route, Link } from 'react-router-dom';
import { Layout, Space, Typography, Button, Spin, Tooltip, theme, Flex, Menu } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';
import 'antd/dist/reset.css';

// 2. 引入你的页面组件
import HomePage from './pages/HomePage';
import PhotosPage from './pages/PhotosPage'; // 我们稍后会创建这个页面
import RestaurantsPage from './pages/RestaurantsPage'; // 假设你还有一个餐厅页面

import { authenticateUser, logout } from './firebase-services';

const { Header, Content, Footer } = Layout; // 引入 Content
const { Title, Text } = Typography;

const App = () => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();
  const userId = user?.uid;

  // Handles Firebase authentication state
  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await authenticateUser();
      setUser(currentUser);
      setAuthReady(true);
    };
    initAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!authReady) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin tip="应用加载中..." size="large" />
      </Layout>
    );
  }

 return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Header 保持不变，但我们可以加上导航菜单 */}
      <Header style={{ backgroundColor: colorBgContainer, padding: '0 24px' }}>
        <Flex justify="space-between" align="center" style={{ height: '100%' }}>
          <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
            <HeartTwoTone twoToneColor="#eb2f96" style={{ marginRight: 8 }} />
            情侣回忆录
          </Title>

          {/* 3. 添加导航菜单 */}
          <Menu mode="horizontal" theme="light" defaultSelectedKeys={['home']}>
            <Menu.Item key="home"><Link to="/">首页</Link></Menu.Item>
            <Menu.Item key="photos"><Link to="/photos">照片墙</Link></Menu.Item>
            <Menu.Item key="restaurants"><Link to="/restaurants">美食记录</Link></Menu.Item>
          </Menu>

          <Space>
            {/* 用户信息和登出按钮 (保持不变) */}
          </Space>
        </Flex>
      </Header>

      {/* 4. 主要内容区域：在这里定义路由规则 */}
      <Content style={{ padding: '24px' }}>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/photos" element={<PhotosPage user={user} />} />
          <Route path="/restaurants" element={<RestaurantsPage user={user} />} />
          {/* 你可以根据需要添加更多路由 */}
        </Routes>
      </Content>
      
      {/* Footer 保持不变 */}
      <Footer style={{ textAlign: 'center' }}>
        情侣回忆录 ©2024
      </Footer>
    </Layout>
  );
};

export default App;