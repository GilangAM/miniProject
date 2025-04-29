import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, List, Image, Modal } from 'antd';
import { Photo, Album } from '../types/types';
import API from '../services/api';

const AlbumPage = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      API.get<Album>(`/albums/${id}`).then((res) => setAlbum(res.data));
      API.get<Photo[]>(`/albums/${id}/photos`).then((res) => setPhotos(res.data));
    }
  }, [id]);

  if (!album) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <Card title={album.title}>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={photos}
          renderItem={(photo) => (
            <List.Item>
              <Card
                hoverable
                cover={
                  <Image
                    src={photo.thumbnailUrl}
                    alt={photo.title}
                    onClick={() => setPreviewUrl(photo.url)}
                    style={{ cursor: 'pointer', objectFit: 'cover', height: 150 }}
                  />
                }
              >
                <Card.Meta title={photo.title} />
              </Card>
            </List.Item>
          )}
        />
      </Card>

      <Modal
        open={!!previewUrl}
        footer={null}
        onCancel={() => setPreviewUrl(null)}
      >
        {previewUrl && (
          <Image
            src={previewUrl}
            style={{ width: '100%' }}
          />
        )}
      </Modal>
    </div>
  );
};

export default AlbumPage;
