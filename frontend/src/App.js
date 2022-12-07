import logo from './logo.svg';
import './App.css';
import Nav from "./components/Nav"
import Home from "./pages/Home"
import PostPage from "./pages/PostPage"
import Tags from "./pages/Tags"
import Tag from "./pages/Tag"
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
<Nav />
        <Routes>
            <Route path="/" element={<Home />} />)
            <Route path="/post/:id" element={<PostPage />} />)
            <Route path="/tags" element={<Tags />} />)
            <Route path="/tags/:id" element={<Tag />} />)
            <Route path="*" element={<h2>Ничего не найдено!</h2>} />)
        </Routes>
    </div>
  )
}

export default App;
