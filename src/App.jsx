/*
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";

import MyPage from "./pages/MyPage"; 

function App() {
  return (
    <Router>
      <div>
        <Header /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;
*/

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