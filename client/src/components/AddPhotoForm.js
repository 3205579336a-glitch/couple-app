// src/components/AddPhotoForm.js
import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';

const AddPhotoForm = ({ onAdd, user }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    // 调用父组件传来的 onAdd 函数，并把表单数据和用户信息传过去
    await onAdd({
      imageUrl: values.imageUrl,
      caption: values.caption,
      authorId: user.uid,
      author: user.displayName || '匿名用户',
    });
    form.resetFields(); // 提交后清空表单
  };

  return (
    <Card title="添加新的回忆" style={{ marginBottom: 24 }}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="imageUrl" label="照片链接 (URL)" rules={[{ required: true, message: '请输入照片链接' }]}>
          <Input placeholder="https://example.com/photo.jpg" />
        </Form.Item>
        <Form.Item name="caption" label="心情或描述" rules={[{ required: true, message: '请输入描述' }]}>
          <Input.TextArea placeholder="这张照片是我们在..." />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            添加照片
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddPhotoForm;