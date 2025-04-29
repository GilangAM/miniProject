import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { Post } from '../types/types';

interface PostFormProps {
  onSubmit: (post: Post) => void;
  initialValues?: Post;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleFinish = (values: Post) => { // Ganti any dengan Post
    onSubmit(values);
  };

  return (
    <Form form={form} onFinish={handleFinish}>
      <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="body" label="Body" rules={[{ required: true, message: 'Please input the body!' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PostForm;