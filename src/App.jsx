import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import PostWrite from "./pages/PostWrite";
import MyPage from "./pages/MyPage";
import WholeList from "./pages/WholeList";

function App() {
    return (
        <Router>
            <>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/post-write" element={<PostWrite />} />
                    <Route path="/post-edit/:id" element={<PostWrite isEditMode={true} />} />
                    <Route path="/whole-list" element={<WholeList />} />
                    <Route path="/profile/:hostId" element={<div>프로필 페이지 준비 중</div>} />
                    <Route path="/chat" element={<div>채팅 페이지 준비 중</div>} />
                    <Route path="*" element={
                        <div style={{ textAlign: "center", marginTop: "200px" }}>
                            <h2>404 - 페이지를 찾을 수 없습니다</h2>
                        </div>
                    } />
                </Routes>
            </>
        </Router>
    );
}

export default App;