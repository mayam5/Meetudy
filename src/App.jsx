import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import PostWrite from "./pages/PostWrite";
import MyPage from "./pages/MyPage"; 

function App() {
  return (
    <Router>
      <div>
        <Header /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/post-write" element={<PostWrite />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;