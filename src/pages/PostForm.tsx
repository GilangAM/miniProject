import React from 'react';
import { Form, Input, Button } from 'antd';
import { Post } from '../types/types';

interface PostFormProps {
  onSubmit: (post: Post) => void;
  initialValues?: Post;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: Post) => {
    const postToSubmit: Post = {
      ...initialValues,
      ...values,
    };
    onSubmit(postToSubmit);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={initialValues}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please input the title!' }]}
      >
        <Input placeholder="Enter a catchy title..." />
      </Form.Item>

      <Form.Item
        name="body"
        label="Body"
        rules={[{ required: true, message: 'Please input the body!' }]}
      >
        <Input.TextArea placeholder="Write something interesting..." rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {initialValues ? 'Update Post' : 'Submit Post'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PostForm;
