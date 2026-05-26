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
    const navigate = useNavigate();

    // 💡 로그인 성공 시 호출되어 마이페이지로 이동시키는 함수
    const handleLoginSuccess = () => {
        setIsLoginOpen(false); // 로그인 창 닫기
        navigate("/mypage");   // 마이페이지 주소로 이동
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

                    {/* 로고 클릭 시 메인 홈으로 이동 */}
                    <Navbar.Brand 
                        style={{ cursor: "pointer" }} 
                        onClick={() => navigate("/")}
                    >
                        <img src={logo} alt="logo" className="header-logo" />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbar" />

                    <Navbar.Collapse id="navbar" className="align-items-center">

                        <div className="search-wrap">
                            <FormControl
                                placeholder="스터디를 검색해보세요"
                                className="search-input"
                            />

                            <div className="search-inner">
                                <Button variant="light" size="sm">
                                    <FiSearch />
                                </Button>

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

                                <Dropdown>
                                    <Dropdown.Toggle variant="light" size="sm">
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

                        <Nav className="header-menu">
                            {/* 내 모임 버튼은 기존대로 유지 */}
                            <Button variant="light" size="sm">
                                내 모임
                            </Button>

                            <Button variant="light" size="sm">
                                글 작성하기
                            </Button>

                            <FiBell size={20} className="header-icon" />

                            {/* 💡 프로필 아이콘 클릭 시 로그인 모달만 열기 */}
                            <FiUser
                                size={20}
                                className="header-icon"
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsLoginOpen(true)}
                            />
                        </Nav>

                    </Navbar.Collapse>

                </Container>
            </Navbar>
            
            {/* 💡 Login 컴포넌트에 로그인 성공 함수(onLoginSuccess)를 전달 */}
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