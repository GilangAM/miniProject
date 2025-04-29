import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UsersPage";
import PostPage from "./pages/Postspage";
import AlbumPage from "./pages/AlbumsPage";
import './App.css';

function App() {
  return (  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/album/:id" element={<AlbumPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
