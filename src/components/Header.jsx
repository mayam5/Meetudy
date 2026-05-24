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
import Login from "../components/Login";

function Header() {

    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <>
            <Navbar
                bg="white"
                expand="lg"
                fixed="top"
                className="header shadow-sm"
            >
                <Container fluid>

                    <Navbar.Brand href="#">
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

                            <Button variant="light" size="sm">
                                내 모임
                            </Button>

                            <Button variant="light" size="sm">
                                글 작성하기
                            </Button>

                            <FiBell size={20} className="header-icon" />

                            {/* 로그인 아이콘 */}
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
            
            {isLoginOpen && (
                <Login onClose={() => setIsLoginOpen(false)} />
            )}
        </>
    );
}

export default Header;