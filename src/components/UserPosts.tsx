import { Table, Button } from 'antd';
import { useEffect, useState } from 'react';
import { Post } from '../types/types';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Props {
  userId: number;
}

const UserPosts = ({ userId }: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get<Post[]>(`/posts?userId=${userId}`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }}>
        Add Post
      </Button>
      <Table
        dataSource={posts}
        columns={[
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
              <a onClick={() => navigate(`/post/${record.id}`)}>{text}</a>
            ),
          },
          {
            title: 'Body',
            dataIndex: 'body',
            key: 'body',
          },
        ]}
        rowKey="id"
      />
    </div>
  );
};

export default UserPosts;
