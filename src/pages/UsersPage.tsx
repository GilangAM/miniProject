import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Col, Row, List, Button, Modal } from "antd";
import API from "../services/api";
import { User, Post, Album } from "../types/types";
import PostForm from "./PostForm";

const UserPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const userResponse = await API.get<User>(`/users/${id}`);
        setUser(userResponse.data);
        const postsResponse = await API.get<Post[]>(`/users/${id}/posts`);
        setPosts(postsResponse.data);
        const albumsResponse = await API.get<Album[]>(`/users/${id}/albums`);
        setAlbums(albumsResponse.data);
      }
    };

    fetchData();
  }, [id]);

  const handleAddPost = (post: Post) => {
    API.post<Post>(`/posts`, { ...post, userId: id }).then((res) => {
      setPosts([...posts, res.data]);
      setIsModalVisible(false);
    });
  };

  const handleEditPost = (post: Post) => {
    API.put<Post>(`/posts/${post.id}`, post).then((res) => {
      setPosts(posts.map((p) => (p.id === res.data.id ? res.data : p)));
      setIsModalVisible(false);
      setEditingPost(null);
    });
  };

  const handleDeletePost = (postId: number) => {
    API.delete(`/posts/${postId}`).then(() => {
      setPosts(posts.filter((post) => post.id !== postId));
    });
  };

  const showModal = (post?: Post) => {
    setEditingPost(post || null);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingPost(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ padding: 20 }}>
        <Row gutter={16}>
          <Col span={24}>
            <Card
              title={user?.name}
              style={{
                marginBottom: 10,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                width: "100%",
              }}
            >
              <p>
                <strong>Username:</strong> {user?.username}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Phone:</strong> {user?.phone}
              </p>
              <p>
                <strong>Website:</strong> {user?.website}
              </p>
            </Card>
          </Col>
        </Row>
      </div>

      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 20 }}
      >
        Tambah Post
      </Button>

      <Row gutter={16}>
        <Col span={12}>
          <Card
            title="Posts"
            style={{
              width: "100%", // Set Posts card width to 50%
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <List
              dataSource={posts}
              renderItem={(post) => (
                <List.Item
                  actions={[
                    <Button onClick={() => showModal(post)}>Edit</Button>,
                    <Button
                      type="default"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Hapus
                    </Button>,
                  ]}
                  style={{ padding: "10px 0" }}
                >
                  <List.Item.Meta
                    title={<Link to={`/post/${post.id}`}>{post.title}</Link>}
                    description={post.body}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Albums"
            style={{
              marginBottom: 8,
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <List
              dataSource={albums}
              renderItem={(album) => (
                <List.Item>
                  <Link to={`/album/${album.id}`}>{album.title}</Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingPost ? "Edit Post" : "Tambah Post"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <PostForm
          onSubmit={editingPost ? handleEditPost : handleAddPost}
          initialValues={editingPost || undefined}
        />
      </Modal>
    </div>
  );
};

export default UserPage;
