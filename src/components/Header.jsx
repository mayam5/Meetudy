// ====================================================
// [백엔드 연결] API 경로
// - GET /api/categories
//     res: { data: [{ categoryId, categoryName }, ...] }
// - GET /api/regions/cities
//     res: string[]
// - GET /api/notifications
//     res: [{ id, type, message, time, read, link }, ...]
// ====================================================

import {
    Navbar, Nav, Container, FormControl, Dropdown, Button
} from "react-bootstrap";

import "./Header.css";

import logo from "../assets/logo.png";
import Chat from "../components/Chat";
import ChatList from "../components/ChatList";
import NotificationList from "../components/NotificationList.jsx";

import { FiSearch, FiBell, FiUser, FiX } from "react-icons/fi";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../components/Login";
import { fetchNotifications, markNotificationRead } from "../api/notification";

const API_BASE = "/api";

function Header() {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

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
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [regionOptions, setRegionOptions] = useState([]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const [regionOpen, setRegionOpen] = useState(false);
    const [fieldOpen, setFieldOpen] = useState(false);
    const [regionClosing, setRegionClosing] = useState(false);
    const [fieldClosing, setFieldClosing] = useState(false);

    const regionTimer = useRef(null);
    const fieldTimer = useRef(null);

    const handleRegionToggle = () => {
        if (regionOpen) {
            setRegionClosing(true);
            regionTimer.current = setTimeout(() => {
                setRegionOpen(false);
                setRegionClosing(false);
            }, 180);
        } else {
            clearTimeout(regionTimer.current);
            setRegionClosing(false);
            setRegionOpen(true);
        }
        setFieldOpen(false);
        setFieldClosing(false);
        clearTimeout(fieldTimer.current);
    };

    const handleFieldToggle = () => {
        if (fieldOpen) {
            setFieldClosing(true);
            fieldTimer.current = setTimeout(() => {
                setFieldOpen(false);
                setFieldClosing(false);
            }, 180);
        } else {
            clearTimeout(fieldTimer.current);
            setFieldClosing(false);
            setFieldOpen(true);
        }
        setRegionOpen(false);
        setRegionClosing(false);
        clearTimeout(regionTimer.current);
    };

    const handleRegionSelect = (value) => {
        setSelectedRegion(value);
        setRegionClosing(true);
        regionTimer.current = setTimeout(() => {
            setRegionOpen(false);
            setRegionClosing(false);
        }, 180);
    };

    const handleFieldSelect = (value) => {
        setSelectedField(value);
        setFieldClosing(true);
        fieldTimer.current = setTimeout(() => {
            setFieldOpen(false);
            setFieldClosing(false);
        }, 180);
    };

    useEffect(() => {
        return () => {
            clearTimeout(regionTimer.current);
            clearTimeout(fieldTimer.current);
        };
    }, []);

    // [백엔드 연결] 카테고리 목록 조회
    useEffect(() => {
        fetch(`${API_BASE}/categories`)
            .then((res) => res.json())
            .then((result) => setCategoryOptions(result.data || []))
            .catch((e) => console.error("헤더 카테고리 불러오기 실패:", e));
    }, []);

    // [백엔드 연결] 지역 목록 조회
    useEffect(() => {
        fetch(`${API_BASE}/regions/cities`)
            .then((res) => res.json())
            .then((result) => setRegionOptions(result || []))
            .catch((e) => console.error("헤더 지역 불러오기 실패:", e));
    }, []);

    // [백엔드 연결] 알림 목록 조회 (로그인 상태일 때만)
    useEffect(() => {
        if (!isLoggedIn) {
            setNotifications([]);
            return;
        }
        const loadNotifications = async () => {
            try {
                const data = await fetchNotifications();
                setNotifications(data || []);
            } catch (e) {
                console.error("알림 로드 실패:", e);
            }
        };
        loadNotifications();
    }, [isLoggedIn]);

    const closeNav = () => setNavExpanded(false);

    const closeAll = () => {
        setIsListOpen(false);
        setIsNotiOpen(false);
        setActiveRoom(null);
    };

    const handleSearch = () => {
        if (!searchValue.trim()) {
            setSearchError(true);
            setTimeout(() => setSearchError(false), 600);
            return;
        }
        const params = new URLSearchParams();
        params.set("search", searchValue.trim());
        if (selectedRegion !== "지역") params.set("region", selectedRegion);
        if (selectedField !== "분야") params.set("field", selectedField);
        closeNav();
        navigate(`/whole-list?${params.toString()}`);
    };

    const handleClearSearch = () => setSearchValue("");

    const handleNotificationClick = () => {
        if (!isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            setIsLoginOpen(true);
            closeNav();
            return;
        }
        setIsNotiOpen((prev) => !prev);
        setIsListOpen(false);
    };

    const handleReadNotification = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
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
        setIsNotiOpen(false);
    };

    const handleLoginSuccess = () => {
        setIsLoginOpen(false);
        closeNav();
        navigate("/mypage");
    };

    const handleLogout = () => {
        logout();
        closeNav();
        closeAll();
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
        setIsListOpen((prev) => !prev);
        setIsNotiOpen(false);
    };

    const handlePostWriteClick = () => {
        if (!isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            setIsLoginOpen(true);
            closeNav();
            return;
        }
        closeNav();
        navigate("/post-write");
    };

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

                                {/* 지역 드롭다운 */}
                                <Dropdown show={regionOpen} onToggle={handleRegionToggle}>
                                    <Dropdown.Toggle variant="light" size="sm">
                                        {selectedRegion}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className={regionClosing ? "dropdown-closing" : ""}>
                                        <Dropdown.Item onClick={() => handleRegionSelect("지역")}>전체</Dropdown.Item>
                                        {regionOptions.map((region) => (
                                            <Dropdown.Item key={region} onClick={() => handleRegionSelect(region)}>
                                                {region}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>

                                {/* 분야 드롭다운 */}
                                <Dropdown show={fieldOpen} onToggle={handleFieldToggle}>
                                    <Dropdown.Toggle variant="light" size="sm">
                                        {selectedField}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className={fieldClosing ? "dropdown-closing" : ""}>
                                        <Dropdown.Item onClick={() => handleFieldSelect("분야")}>전체</Dropdown.Item>
                                        {categoryOptions.map((category) => (
                                            <Dropdown.Item key={category.categoryId} onClick={() => handleFieldSelect(category.categoryName)}>
                                                {category.categoryName}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>

                        <Nav className="header-menu position-relative">
                            <Button variant="light" size="sm" onClick={handleMyGroupClick}>내 채팅방</Button>
                            <Button variant="light" size="sm" onClick={handlePostWriteClick}>글 작성하기</Button>

                            <div className="noti-bell-wrap">
                                <Button className="icon-button" variant="light" size="sm" onClick={handleNotificationClick}>
                                    <FiBell size={20} />
                                </Button>
                                {unreadCount > 0 && <span className="noti-badge">{unreadCount}</span>}
                            </div>

                            <Button
                                className={`icon-button ${isLoggedIn ? "logged-in" : ""}`}
                                variant="light" size="sm" onClick={handleProfileClick}
                            >
                                <FiUser size={20} />
                            </Button>

                            {isLoggedIn && (
                                <Button variant="light" size="sm" className="logout-btn" onClick={handleLogout}>
                                    로그아웃
                                </Button>
                            )}
                        </Nav>

                        {(isListOpen || activeRoom || isNotiOpen) && (
                            <div className="chat-overlay" onClick={closeAll} />
                        )}
                        {isListOpen && (
                            <div className="chat-wrapper">
                                <ChatList onSelectRoom={handleSelectRoom} onClose={() => setIsListOpen(false)} />
                            </div>
                        )}
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

            {activeRoom && (
                <div className="chat-wrapper-fixed">
                    <Chat roomId={activeRoom.id} roomTitle={activeRoom.title} onClose={() => setActiveRoom(null)} />
                </div>
            )}
            {isLoginOpen && (
                <Login onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
            )}
        </>
    );
}

export default Header;