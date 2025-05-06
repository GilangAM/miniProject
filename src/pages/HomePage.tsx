import { Table, Spin, Alert, Card, Typography, Input } from 'antd';
import { useEffect, useState } from 'react';
import { User } from '../types/types';
import API from '../services/api';
import { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get<User[]>('/users');
        setUsers(res.data);
      } catch (err) {
        setError('Gagal memuat data pengguna');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    [user.name, user.username, user.email].some((field) =>
      field.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => <Link to={`/user/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ['ascend', 'descend'],
    },
  ];

  if (loading) {
    return <Spin size="large" style={{ marginTop: 100, display: 'flex', justifyContent: 'center' }} />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      {/* Hero Section */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 8,
          background: '#fafafa',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <Title level={2}>👋 Selamat Datang di User Directory</Title>
        <Paragraph>
          Halaman ini menampilkan daftar pengguna dari JSONPlaceholder API.
          Kamu bisa mencari dan mengurutkan pengguna berdasarkan nama, username, atau email.
        </Paragraph>
      </Card>

      {/* Search Input */}
      <Input.Search
        placeholder="Cari berdasarkan nama, username, atau email..."
        allowClear
        enterButton
        size="large"
        onSearch={(value) => setSearchText(value)}
        style={{ marginBottom: 16 }}
      />

      {/* Table Users */}
      <Card title="Daftar Pengguna" variant="outlined">
        <Table<User>
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default HomePage;
