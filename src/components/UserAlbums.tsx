import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { Album } from '../types/types';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Props {
  userId: number;
}

const UserAlbums = ({ userId }: Props) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get<Album[]>(`/albums?userId=${userId}`)
      .then((res) => setAlbums(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  return (
    <Table
      dataSource={albums}
      columns={[
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          render: (text, record) => (
            <a onClick={() => navigate(`/album/${record.id}`)}>{text}</a>
          ),
        },
      ]}
      rowKey="id"
    />
  );
};

export default UserAlbums;
