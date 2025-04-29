import { Table, Spin, Alert } from 'antd';
import { useEffect, useState } from 'react';
import { User } from '../types/types';
import API from '../services/api';
import { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/user/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Users</h1>
      <Table<User> dataSource={users} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default HomePage;