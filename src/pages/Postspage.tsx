import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Button, Modal, Form, Input, Spin, Empty } from "antd";
import API from "../services/api";
import { Comment, Post } from "../types/types";

const { TextArea } = Input;

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const postRes = await API.get<Post>(`/posts/${id}`);
        setPost(postRes.data);

        const stored = localStorage.getItem(`comments_post_${id}`);
        setComments(stored ? JSON.parse(stored) : []);
      } catch (err) {
        console.error("Failed to load post or comments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const saveComments = (data: Comment[]) => {
    localStorage.setItem(`comments_post_${id}`, JSON.stringify(data));
    setComments(data);
  };

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

  
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingComment) {
        const updated = comments.map((c) =>
          c.id === editingComment.id ? { ...c, ...values } : c
        );
        saveComments(updated);
      } else {
        const newComment: Comment = {
          id: Date.now(),
          postId: parseInt(id!),
          ...values,
        };
        saveComments([...comments, newComment]);
      }
      setIsModalVisible(false);
    });
  };

  const handleDelete = (commentId: number) => {
    Modal.confirm({
      title: "Yakin ingin menghapus komentar ini?",
      onOk: () => {
        const updated = comments.filter((c) => c.id !== commentId);
        saveComments(updated);
      },
    });
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => navigate(-1)} style={{ marginRight: 8 }}>
          ←
        </Button>
        <Link to="/">
          <Button type="dashed">Home</Button>
        </Link>
      </div>

      {post && (
        <Card title={post.title} style={{ borderRadius: 12 }}>
          <p>{post.body}</p>
        </Card>
      )}

      <div style={{ marginTop: 24 }}>
        <h2>Komentar</h2>
        <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
          Tambah Komentar
        </Button>

        {comments.length === 0 ? (
          <Empty description="Belum ada komentar." />
        ) : (
          comments.map((comment) => (
            <Card
              key={comment.id}
              size="small"
              title={comment.name}
              extra={
                <>
                  <Button type="link" onClick={() => openModal(comment)}>
                    Edit
                  </Button>
                  <Button type="link" danger onClick={() => handleDelete(comment.id)}>
                    Hapus
                  </Button>
                </>
              }
              style={{ marginBottom: 16, borderRadius: 10 }}
            >
              <p>{comment.body}</p>
              <small style={{ color: "gray" }}>{comment.email}</small>
            </Card>
          ))
        )}
      </div>

      <Modal
        open={isModalVisible}
        title={editingComment ? "Edit Komentar" : "Tambah Komentar"}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        okText={editingComment ? "Update" : "Simpan"}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Nama" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="body" label="Komentar" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PostPage;
