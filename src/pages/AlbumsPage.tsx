import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, List, Image, Spin, Select, Input, Button } from "antd";
import { Photo, Album } from "../types/types";
import API from "../services/api";

const { Search } = Input;
const { Option } = Select;

const AlbumPage = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        API.get<Album>(`/albums/${id}`),
        API.get<Photo[]>(`/albums/${id}/photos`),
      ])
        .then(([albumRes, photosRes]) => {
          setAlbum(albumRes.data);
          setPhotos(photosRes.data);
          setFilteredPhotos(photosRes.data);
          console.log("Photos fetched:", photosRes.data);
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSortChange = (value: string) => {
    const sortedPhotos = [...filteredPhotos];

    switch (value) {
      case "title_asc":
        sortedPhotos.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        sortedPhotos.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "id_asc":
        sortedPhotos.sort((a, b) => a.id - b.id);
        break;
      case "id_desc":
        sortedPhotos.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    setFilteredPhotos(sortedPhotos);
  };

  const handleSearch = (value: string) => {
    const filtered = photos.filter((photo) =>
      photo.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPhotos(filtered);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!album) return <div>Album tidak ditemukan.</div>;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
      <Button type="primary" onClick={handleBack} style={{ marginBottom: 16, marginInlineEnd: 5 }}>
        ←
      </Button>

      <Link to={`/`}>
        <Button type="dashed" style={{ marginBottom: 16 }}>
          Home
        </Button>
      </Link>

      <Card
        title={album.title}
        style={{
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Sort and Search */}
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            gap: "10px",
          }}
        >
          <Select
            placeholder="Sortir berdasarkan"
            style={{ width: 200 }}
            onChange={handleSortChange}
          >
            <Option value="title_asc">Judul A-Z</Option>
            <Option value="title_desc">Judul Z-A</Option>
            <Option value="id_asc">ID Ascending</Option>
            <Option value="id_desc">ID Descending</Option>
          </Select>

          <Search
            placeholder="Cari foto..."
            onSearch={handleSearch}
            style={{ flex: 1 }}
          />
        </div>

        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={filteredPhotos}
          renderItem={(photo) => (
            <List.Item>
              <Card
                hoverable
                cover={
                  <Image
                    src={photo.thumbnailUrl || "https://placehold.co/150x150?text=No+Image"}
                    alt={photo.title}
                    fallback="https://placehold.co/150x150?text=No+Image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/150x150?text=No+Image";
                    }}
                    style={{
                      cursor: "pointer",
                      objectFit: "cover",
                      height: 150,
                      borderRadius: 8,
                    }}
                    onClick={() => {
                      console.log("Judul gambar:", photo.title);
                    }}
                  />
                }
              >
                <Card.Meta title={photo.title} />
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default AlbumPage;
