import {
    Navbar, Nav, Container, FormControl, Dropdown, Button
} from "react-bootstrap";

import "./Header.css";
import logo from "../assets/logo.png";
import Chat from "../components/Chat";
import ChatList from "../components/ChatList";
import NotificationList from "../components/NotificationList";

import { FiSearch, FiBell, FiUser, FiX } from "react-icons/fi";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../components/Login";
import { fetchNotifications, markNotificationRead } from "../api/notification";

function Header() {
    const { isLoggedIn, logout } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isListOpen, setIsListOpen] = useState(false);
    const [isNotiOpen, setIsNotiOpen] = useState(false);
    const [activeRoom, setActiveRoom] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [searchError, setSearchError] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState("지역");
    const [selectedField, setSelectedField] = useState("분야");
    const [navExpanded, setNavExpanded] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const navigate = useNavigate();
    const unreadCount = notifications.filter((n) => !n.read).length;

    // 로그인 시 알림 로드
    useEffect(() => {
        if (!isLoggedIn) return;
        const load = async () => {
            try {
                const data = await fetchNotifications();
                setNotifications(data);
            } catch (e) {
                console.error("알림 로드 실패:", e);
            }
        };
        load();
    }, [isLoggedIn]);

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

    const handleClearSearch = () => setSearchValue("");

    const handleNotificationClick = () => {
        setIsNotiOpen(!isNotiOpen);
        setIsListOpen(false);
    };

    const handleReadNotification = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications((prev) =>
                prev.map((n) => n.id === id ? { ...n, read: true } : n)
            );
        } catch (e) {
            console.error("알림 읽음 처리 실패:", e);
        }
    };

    const handleReadAll = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const handleSelectRoom = (room) => {
        setActiveRoom(room);
        setIsListOpen(false);
    };

    const closeAll = () => {
        setIsListOpen(false);
        setIsNotiOpen(false);
        setActiveRoom(null);
    };

    const handleLoginSuccess = () => {
        setIsLoginOpen(false);
        closeNav();
        navigate("/mypage");
    };

    const handleLogout = () => {
        logout();
        closeNav();
        navigate("/");
    };

    const handleProfileClick = () => {
        closeNav();
        if (isLoggedIn) navigate("/mypage");
        else setIsLoginOpen(true);
    };

    const handleMyGroupClick = () => {
        if (!isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            setIsLoginOpen(true);
            closeNav();
            return;
        }
        setIsListOpen(!isListOpen);
        setIsNotiOpen(false);
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

                    <Navbar.Brand
                        style={{ cursor: "pointer" }}
                        onClick={() => { closeNav(); navigate("/"); }}
                    >
                        <img src={logo} alt="logo" className="header-logo" />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbar" />

                    <Navbar.Collapse id="navbar" className="align-items-center">

                        {/* 검색 */}
                        <div className="search-wrap">
                            <FormControl
                                placeholder="스터디를 검색해보세요"
                                className={`search-input ${searchError ? "search-error" : ""}`}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <div className="search-inner">
                                {searchValue && (
                                    <Button className="icon-button" variant="light" size="sm" onClick={handleClearSearch}>
                                        <FiX size={14} />
                                    </Button>
                                )}
                                <Button className="icon-button" variant="light" size="sm" onClick={handleSearch}>
                                    <FiSearch />
                                </Button>
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" size="sm">{selectedRegion}</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setSelectedRegion("지역")}>전체</Dropdown.Item>
                                        {REGIONS.map((r) => (
                                            <Dropdown.Item key={r} onClick={() => setSelectedRegion(r)}>{r}</Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" size="sm">{selectedField}</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setSelectedField("분야")}>전체</Dropdown.Item>
                                        {FIELDS.map((f) => (
                                            <Dropdown.Item key={f} onClick={() => setSelectedField(f)}>{f}</Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>

                        {/* 우측 메뉴 */}
                        <Nav className="header-menu position-relative">

                            <Button variant="light" size="sm" onClick={handleMyGroupClick}>
                                내 모임
                            </Button>

                            <Button variant="light" size="sm" onClick={() => { closeNav(); navigate("/post-write"); }}>
                                글 작성하기
                            </Button>

                            {/* 알림 */}
                            <div className="noti-bell-wrap">
                                <Button className="icon-button" variant="light" size="sm" onClick={handleNotificationClick}>
                                    <FiBell size={20} />
                                </Button>
                                {unreadCount > 0 && (
                                    <span className="noti-badge">{unreadCount}</span>
                                )}
                            </div>

                            {/* 프로필 */}
                            <Button
                                className={`icon-button ${isLoggedIn ? "logged-in" : ""}`}
                                variant="light"
                                size="sm"
                                onClick={handleProfileClick}
                            >
                                <FiUser size={20} />
                            </Button>

                            {/* 로그아웃 */}
                            {isLoggedIn && (
                                <Button variant="light" size="sm" className="logout-btn" onClick={handleLogout}>
                                    로그아웃
                                </Button>
                            )}

                        </Nav>

                        {/* overlay */}
                        {(isListOpen || activeRoom || isNotiOpen) && (
                            <div className="chat-overlay" onClick={closeAll} />
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

                        {/* 알림 목록 */}
                        {isNotiOpen && (
                            <div className="chat-wrapper">
                                <NotificationList
                                    notifications={notifications}
                                    onRead={handleReadNotification}
                                    onReadAll={handleReadAll}
                                    onClose={() => setIsNotiOpen(false)}
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
                        roomId={activeRoom.id}
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