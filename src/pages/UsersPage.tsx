import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Card,
  Col,
  Row,
  List,
  Button,
  Modal,
  Select,
  Input,
  Avatar,
  message,
} from "antd";
import API from "../services/api";
import { User, Post, Album } from "../types/types";
import PostForm from "./PostForm";
import { useCallback } from "react";

const { Option } = Select;
const { Search } = Input;

const LOCAL_STORAGE_KEY = "user_posts";

const UserPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const avatarUrl = `https://randomuser.me/api/portraits/men/${Math.floor(
    Math.random() * 100
  )}.jpg`;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [userRes, postsRes, albumsRes] = await Promise.all([
          API.get<User>(`/users/${id}`),
          API.get<Post[]>(`/users/${id}/posts`),
          API.get<Album[]>(`/users/${id}/albums`),
        ]);

        setUser(userRes.data);
        setAlbums(albumsRes.data);

        const localData = JSON.parse(
          localStorage.getItem(LOCAL_STORAGE_KEY) || "{}"
        );
        const localPosts: Post[] = localData[id] || [];
        setPosts([...postsRes.data, ...localPosts]);
      } catch (err) {
        console.error(err);
        message.error("Gagal memuat data");
      }
    };

    fetchData();
  }, [id]);

  const saveToLocal = (updatedPosts: Post[]) => {
    const existingData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY) || "{}"
    );
    existingData[id!] = updatedPosts;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingData));
  };

  const handleAddPost = (post: Post) => {
    try {
      const newPost: Post = {
        ...post,
        id: Date.now(),
        userId: Number(id),
      };
      const updatedPosts = [...posts, newPost];
      setPosts(updatedPosts);
      saveToLocal(updatedPosts);
      setIsModalVisible(false);
      message.success("Post berhasil ditambahkan");
    } catch (error) {
      console.error(error);
      message.error("Gagal menambahkan post");
    }
  };

  const handleEditPost = (updatedPost: Post) => {
    try {
      const updatedPosts = posts.map((p) =>
        p.id === updatedPost.id ? updatedPost : p
      );
      const isUpdated = posts.some((p) => p.id === updatedPost.id);

      if (!isUpdated) {
        message.error("Post yang ingin diedit tidak ditemukan");
        return;
      }

      setPosts(updatedPosts);
      saveToLocal(updatedPosts);
      setEditingPost(null);
      setIsModalVisible(false);
      message.success("Post berhasil diperbarui");
    } catch (error) {
      console.error(error);
      message.error("Gagal memperbarui post");
    }
  };

  const handleDeletePost = (postId: number) => {
    Modal.confirm({
      title: "Yakin ingin menghapus post ini?",
      content: "Tindakan ini tidak dapat dibatalkan.",
      okText: "Hapus",
      okType: "danger",
      cancelText: "Batal",
      onOk() {
        try {
          const updatedPosts = posts.filter((post) => post.id !== postId);
          setPosts(updatedPosts);
          saveToLocal(updatedPosts);
          message.success("Post berhasil dihapus");
        } catch (error) {
          console.error(error);
          message.error("Gagal menghapus post");
        }
      },
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

  const getFilteredAndSortedPosts = useCallback(() => {
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOption) {
      case "title_asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "shortest":
        filtered.sort((a, b) => a.title.length - b.title.length);
        break;
      case "longest":
        filtered.sort((a, b) => b.title.length - a.title.length);
        break;
    }

    return filtered;
  }, [posts, sortOption, searchTerm]);

  useEffect(() => {
    const result = getFilteredAndSortedPosts();
    setFilteredPosts(result);
  }, [getFilteredAndSortedPosts]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
      <Button
        type="primary"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16, marginRight: 8 }}
      >
        ←
      </Button>
      <Link to="/">
        <Button type="dashed">Home</Button>
      </Link>

      <Row gutter={16} style={{ marginBottom: 10 }}>
        <Col span={24}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <Avatar src={avatarUrl} size={64} style={{ marginRight: 16 }} />
                <span style={{ fontSize: 18, fontWeight: "bold" }}>
                  {user?.name}
                </span>
              </div>
            }
            style={{
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f9f9f9",
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

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title="Posts"
            style={{
              borderRadius: 8,
              height: 450,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                marginBottom: 10,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <Button type="primary" onClick={() => showModal()}>
                Tambah Post
              </Button>
              <Select
                allowClear
                placeholder="Sortir"
                style={{ width: 160 }}
                onChange={(val) => setSortOption(val)}
              >
                <Option value="title_asc">Judul A-Z</Option>
                <Option value="title_desc">Judul Z-A</Option>
                <Option value="shortest">Judul Terpendek</Option>
                <Option value="longest">Judul Terpanjang</Option>
              </Select>
              <Search
                placeholder="Cari judul..."
                allowClear
                style={{ flex: 1, minWidth: 160 }}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ overflowY: "auto", flex: 1 }}>
              <List
                dataSource={filteredPosts}
                renderItem={(post) => (
                  <List.Item
                    key={post.id}
                    actions={[
                      <Button onClick={() => showModal(post)}>Edit</Button>,
                      <Button danger onClick={() => handleDeletePost(post.id)}>
                        Hapus
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<Link to={`/post/${post.id}`}>{post.title}</Link>}
                      description={post.body}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="Albums"
            style={{
              borderRadius: 8,
              height: 450,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        <PostForm
          key={editingPost ? `edit-${editingPost.id}` : `add-${Date.now()}`}
          onSubmit={editingPost ? handleEditPost : handleAddPost}
          initialValues={editingPost ?? undefined}
        />
      </Modal>
    </div>
  );
};

export default UserPage;
