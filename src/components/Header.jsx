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
import ChatList from "../components/ChatList"; // ChatList 가져오기

import {
    FiSearch,
    FiBell,
    FiUser
} from "react-icons/fi";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";

function Header() {

    const [isLoginOpen, setIsLoginOpen] = useState(false);

    // 로그인 상태 추가
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // [변경] 내 모임 목록 창 열림 상태 관리
    const [isListOpen, setIsListOpen] = useState(false);

    // [변경] 현재 열려있는 상세 채팅창 관리 (null이면 닫힘, 문자열이면 열림)
    const [activeRoom, setActiveRoom] = useState(null);

    const handleSelectRoom = (room) => {
        setActiveRoom(room);
    };

    const closeAll = () => {
        setIsListOpen(false);
        setActiveRoom(null);
    };
    const navigate = useNavigate();

    // 로그인 성공 시
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setIsLoginOpen(false);
        navigate("/mypage");
    };

    // 프로필 아이콘 클릭
    const handleProfileClick = () => {
        if (isLoggedIn) {
            navigate("/mypage");
        } else {
            setIsLoginOpen(true);
        }
    };

    // 내 모임 버튼 클릭 핸들러
    const handleMyGroupClick = () => {
        if (!isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            setIsLoginOpen(true);
            return;
        }
        // 로그인 상태면 모임 목록 창을 토글(켜고 끔)
        setIsListOpen(!isListOpen);
    };

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

                        {/* 검색 */}
                        <div className="search-wrap">

                            <FormControl
                                placeholder="스터디를 검색해보세요"
                                className="search-input"
                            />

                            <div className="search-inner">

                                <Button
                                    variant="light"
                                    size="sm"
                                >
                                    <FiSearch />
                                </Button>

                                <Dropdown>

                                    <Dropdown.Toggle
                                        variant="light"
                                        size="sm"
                                    >
                                        지역
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item>서울</Dropdown.Item>
                                        <Dropdown.Item>경기</Dropdown.Item>
                                        <Dropdown.Item>부산</Dropdown.Item>
                                    </Dropdown.Menu>

                                </Dropdown>

                                <Dropdown>

                                    <Dropdown.Toggle
                                        variant="light"
                                        size="sm"
                                    >
                                        분야
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item>개발</Dropdown.Item>
                                        <Dropdown.Item>자격증</Dropdown.Item>
                                        <Dropdown.Item>외국어</Dropdown.Item>
                                    </Dropdown.Menu>

                                </Dropdown>

                            </div>
                        </div>

                        {/* 우측 메뉴 */}
                        {/* 목록 배치를 위해 기준이 되는 position-relative 스타일을 인라인으로 추가했습니다 */}
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
                            >
                                글 작성하기
                            </Button>

                            <FiBell
                                size={20}
                                className="header-icon"
                            />

                            {/* 프로필 */}
                            <FiUser
                                size={20}
                                className="header-icon"
                                style={{ cursor: "pointer" }}
                                onClick={handleProfileClick}
                            />

                            {/* [변경] 버튼 바로 아래쪽에 목록 창을 조건부 렌더링 */}
                            {isListOpen && (
    <div className="chat-dropdown-panel">

        <ChatList
  onSelectRoom={handleSelectRoom}
  onClose={() => setIsListOpen(false)}
/>

        {activeRoom && (
            <Chat
                roomTitle={activeRoom.title}
                onClose={() => setActiveRoom(null)}
            />
        )}

    </div>
)}

                        </Nav>

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

            {/* [변경] activeRoomTitle에 값이 담겨 있을 때만 카카오톡 상세 채팅창 오픈 */}
            {activeRoom && (
                <Chat
                    roomTitle={activeRoom.title}
                    onClose={() => setActiveRoom(null)}
                />
            )}

        </>
    );
}

export default Header;
