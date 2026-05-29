import {
    Navbar,
    Nav,
    Container,
    FormControl,
    Dropdown,
    Button
} from "react-bootstrap";



import "./Header.css";
import logo from "../assets/logo.png";
import Chat from "../components/Chat";
import ChatList from "../components/ChatList";

import {
    FiSearch,
    FiBell,
    FiUser
} from "react-icons/fi";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";

function Header() {

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 채팅 목록 열림 상태
    const [isListOpen, setIsListOpen] = useState(false);

    // 현재 선택된 채팅방
    const [activeRoom, setActiveRoom] = useState(null);

    // 채팅방 선택 시 실행
    const handleSelectRoom = (room) => {
        setActiveRoom(room);
    };

    const handleSearch = () => {
        alert("검색 기능 준비 중");
    };
    const handleNotificationClick = () => {
        alert("알림 기능 준비 중");
    };






    // 모든 창 닫기 (채팅 + 리스트)
    const closeAll = () => {
        setIsListOpen(false);
        setActiveRoom(null);
    };

    const navigate = useNavigate();

    // 로그인 성공 처리
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setIsLoginOpen(false);
        navigate("/mypage");
    };

    // 프로필 클릭 처리
    const handleProfileClick = () => {
        if (isLoggedIn) {
            navigate("/mypage");
        } else {
            setIsLoginOpen(true);
        }
    };

    // 내 모임 버튼 클릭
    const handleMyGroupClick = () => {
        if (!isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            setIsLoginOpen(true);
            return;
        }

        setIsListOpen(!isListOpen);
    };

    // 글 작성하기 버튼 클릭
    const handlePostWriteClick = () => {

        if (!isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            setIsLoginOpen(true);
            return;
        }

        navigate("/postwrite");
    };


    // 카테고리 연결
    const [categoryOptions, setCategoryOptions] = useState([]);

    useEffect(() => {
    fetch("http://localhost:8080/categories")
        .then((res) => res.json())
        .then((result) => {
        setCategoryOptions(result.data);
        })
        .catch((error) => {
        console.error("헤더 카테고리 불러오기 실패:", error);
        });
    }, []);

    return (
        <>
            <Navbar
                bg="white"
                expand="lg"
                fixed="top"
                className="header shadow-sm"
            >
                <Container fluid>

                    {/* 로고 */}
                    <Navbar.Brand
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        <img
                            src={logo}
                            alt="logo"
                            className="header-logo"
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbar" />

                    <Navbar.Collapse
                        id="navbar"
                        className="align-items-center"
                    >

                        {/* 검색 영역 */}
                        <div className="search-wrap">

                            <FormControl
                                placeholder="스터디를 검색해보세요"
                                className="search-input"
                            />

                            <div className="search-inner">

                                <Button
                                    className="icon-button"
                                    variant="light"
                                    size="sm"
                                    onClick={handleSearch}
                                >
                                    <FiSearch />
                                </Button>

                                {/* 지역 선택 */}
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" size="sm">
                                        지역
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>서울</Dropdown.Item>
                                        <Dropdown.Item>경기</Dropdown.Item>
                                        <Dropdown.Item>부산</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                                {/* 분야 선택 */}
                                <Dropdown>
                                <Dropdown.Toggle variant="light" size="sm">
                                    분야
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {categoryOptions.map((category) => (
                                    <Dropdown.Item key={category.categoryId}>
                                        {category.categoryName}
                                    </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                                </Dropdown>

                            </div>
                        </div>

                        {/* 우측 메뉴 */}
                        <Nav className="header-menu position-relative">

                            <Button
                                variant="light"
                                size="sm"
                                onClick={handleMyGroupClick}
                            >
                                내 모임
                            </Button>

                            <Button
                            variant="light"
                            size="sm"
                            onClick={() => navigate("/postwrite")}
                            >
                            글 작성하기
                            </Button>

                            <Button
                                className="icon-button"
                                variant="light"
                                size="sm"
                                onClick={handlePostWriteClick}
                            >
                                <FiBell size={20} />
                            </Button>

                            <Button
                                variant="light"
                                size="sm"
                                className="icon-button"
                                onClick={handleProfileClick}
                            >
                                <FiUser size={20} />
                            </Button>
                        </Nav>

                        {/* 채팅 목록 */}
                        {isListOpen && (
                            <>
                                {/* 바깥 클릭 영역 */}
                                <div
                                    className="chat-overlay"
                                    onClick={closeAll}
                                />

                                {/* 채팅 리스트 */}
                                <div className="chat-wrapper">
                                    <ChatList
                                        onSelectRoom={handleSelectRoom}
                                        onClose={() => setIsListOpen(false)}
                                    />
                                </div>
                            </>
                        )}

                    </Navbar.Collapse>

                </Container>
            </Navbar>

            {/* 로그인 모달 */}
            {isLoginOpen && (
                <Login
                    onClose={() => setIsLoginOpen(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}

            {/* 채팅창 */}
            {activeRoom && (
                <>
                    <div
                        className="chat-overlay"
                        onClick={closeAll}
                    />

                    <div className="chat-wrapper">
                        <Chat
                            roomTitle={activeRoom.title}
                            onClose={() => setActiveRoom(null)}
                        />
                    </div>
                </>
            )}

        </>
    );
}

export default Header;