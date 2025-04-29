import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, List, Button, Modal, Form, Input } from 'antd';
import { Comment, Post } from '../types/types';
import API from '../services/api';

const { TextArea } = Input;

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      API.get<Post>(`/posts/${id}`).then((res) => setPost(res.data));
      API.get<Comment[]>(`/posts/${id}/comments`).then((res) => setComments(res.data));
    }
  }, [id]);

  const openModal = (comment?: Comment) => {
    if (comment) {
      form.setFieldsValue(comment);
      setEditingComment(comment);
    } else {
      form.resetFields();
      setEditingComment(null);
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingComment) {
        // Update comment
        setComments((prev) =>
          prev.map((c) => (c.id === editingComment.id ? { ...c, ...values } : c))
        );
      } else {
        // Add new comment
        const newComment: Comment = {
          id: Math.floor(Math.random() * 10000),
          postId: post!.id,
          ...values,
        };
        setComments((prev) => [...prev, newComment]);
      }
      setIsModalVisible(false);
    });
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this comment?',
      onOk: () => {
        setComments((prev) => prev.filter((c) => c.id !== id));
      },
    });
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <Card title={post.title}>
        <p>{post.body}</p>
      </Card>

      <div style={{ marginTop: 24 }}>
        <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
          Add Comment
        </Button>
        <List
          dataSource={comments}
          renderItem={(item) => (
            <List.Item
              actions={[
                <a key="edit" onClick={() => openModal(item)}>Edit</a>,
                <a key="delete" onClick={() => handleDelete(item.id)}>Delete</a>,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={item.body}
              />
            </List.Item>
          )}
        />
      </div>

      <Modal
        title={editingComment ? "Edit Comment" : "Add Comment"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="body" label="Comment" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PostPage;
