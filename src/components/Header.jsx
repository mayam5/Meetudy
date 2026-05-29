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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";

function Header() {

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => localStorage.getItem("isLoggedIn") === "true"
    );
    const [isListOpen, setIsListOpen] = useState(false);
    const [activeRoom, setActiveRoom] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [searchError, setSearchError] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState("지역");
    const [selectedField, setSelectedField] = useState("분야");
    const [navExpanded, setNavExpanded] = useState(false);

    const navigate = useNavigate();

    const closeNav = () => setNavExpanded(false);

    const handleSearch = () => {
        if (!searchValue.trim()) {
            setSearchError(true);
            setTimeout(() => setSearchError(false), 600);
            return;
        }
        closeNav();
        navigate(`/whole-list?search=${searchValue}&region=${selectedRegion}&field=${selectedField}`);
    };

    // 알림 - closeNav 없음 (드롭다운 예정)
    const handleNotificationClick = () => {
        alert("알림 기능 준비 중");
    };

    const handleSelectRoom = (room) => {
        setActiveRoom(room);
    };

    const closeAll = () => {
        setIsListOpen(false);
        setActiveRoom(null);
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        setIsLoginOpen(false);
        closeNav();
        navigate("/mypage");
    };

    const handleProfileClick = () => {
        closeNav();
        if (isLoggedIn) {
            navigate("/mypage");
        } else {
            setIsLoginOpen(true);
        }
    };

    // 내 모임 - closeNav 없음 (채팅리스트 드롭다운)
    // 단, 비로그인 시에는 닫기
    const handleMyGroupClick = () => {
        if (!isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            setIsLoginOpen(true);
            closeNav();
            return;
        }
        setIsListOpen(!isListOpen);
    };

    const REGIONS = ["서울", "경기", "부산"];
    const FIELDS = ["개발", "자격증", "외국어"];

    return (
        <>
            <Navbar
                bg="white"
                expand="lg"
                fixed="top"
                className="header shadow-sm"
                expanded={navExpanded}
                onToggle={(expanded) => setNavExpanded(expanded)}
            >
                <Container fluid>

                    {/* 로고 */}
                    <Navbar.Brand
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            closeNav();
                            navigate("/");
                        }}
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
                                className={`search-input ${searchError ? "search-error" : ""}`}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                                        {selectedRegion}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setSelectedRegion("지역")}>
                                            전체
                                        </Dropdown.Item>
                                        {REGIONS.map((r) => (
                                            <Dropdown.Item
                                                key={r}
                                                onClick={() => setSelectedRegion(r)}
                                            >
                                                {r}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>

                                {/* 분야 선택 */}
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" size="sm">
                                        {selectedField}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setSelectedField("분야")}>
                                            전체
                                        </Dropdown.Item>
                                        {FIELDS.map((f) => (
                                            <Dropdown.Item
                                                key={f}
                                                onClick={() => setSelectedField(f)}
                                            >
                                                {f}
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
                                onClick={() => {
                                    closeNav();
                                    navigate("/post-write");
                                }}
                            >
                                글 작성하기
                            </Button>

                            <Button
                                className="icon-button"
                                variant="light"
                                size="sm"
                                onClick={handleNotificationClick}
                            >
                                <FiBell size={20} />
                            </Button>

                            <Button
                                className="icon-button"
                                variant="light"
                                size="sm"
                                onClick={handleProfileClick}
                            >
                                <FiUser size={20} />
                            </Button>

                        </Nav>

                        {/* 채팅 overlay */}
                        {(isListOpen || activeRoom) && (
                            <div
                                className="chat-overlay"
                                onClick={closeAll}
                            />
                        )}

                        {/* 채팅 목록 */}
                        {isListOpen && (
                            <div className="chat-wrapper">
                                <ChatList
                                    onSelectRoom={handleSelectRoom}
                                    onClose={() => setIsListOpen(false)}
                                />
                            </div>
                        )}

                    </Navbar.Collapse>

                </Container>
            </Navbar>

            {/* 채팅창 */}
            {activeRoom && (
                <div className="chat-wrapper-fixed">
                    <Chat
                        roomTitle={activeRoom.title}
                        onClose={() => setActiveRoom(null)}
                    />
                </div>
            )}

            {/* 로그인 모달 */}
            {isLoginOpen && (
                <Login
                    onClose={() => setIsLoginOpen(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}

        </>
    );
}

export default Header;