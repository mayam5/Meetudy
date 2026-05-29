
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/Header";
import Home from "./pages/Home";
import PostWrite from "./pages/PostWrite";
import MyPage from "./pages/MyPage";
import WholeList from "./pages/WholeList";
import StudyDetail from "./pages/StudyDetail";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

function App() {
    return (
        <Router>
            <ScrollToTop />
            <>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/mypage" element={
                        <ProtectedRoute><MyPage /></ProtectedRoute>
                    } />
                    <Route path="/post-write" element={<PostWrite />} />
                    <Route path="/post-edit/:id" element={<PostWrite isEditMode={true} />} />
                    <Route path="/whole-list" element={<WholeList />} />
                    <Route path="/study/:id" element={<StudyDetail />} />
                    <Route path="/profile/:hostId" element={<ProfilePage />} />
                    <Route path="/chat" element={
                        <ProtectedRoute><ChatPage /></ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </>
        </Router>
    );
}

export default App;

/*

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Login from "./components/Login";
import Home from "./pages/Home";
import WholeList from "./pages/WholeList";
import PostWrite from "./pages/PostWrite";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wholelist" element={<WholeList />} />
        <Route path="/postwrite" element={<PostWrite />} />
      </Routes>


    </Router>
  );
}

export default App;
*/