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

function Header() {
    return (
        <Navbar
            bg="white"
            expand="lg"
            fixed="top"
            className="header shadow-sm"
        >
            <Container fluid>

                {/* 로고 */}
                <Navbar.Brand href="#">
                    <img
                        src={logo}
                        alt="logo"
                        className="header-logo"
                    />
                </Navbar.Brand>

                {/* 햄버거 버튼 */}
                <Navbar.Toggle aria-controls="navbar" />

                {/* 네브 영역 */}
                <Navbar.Collapse
                    id="navbar"
                    className="align-items-center"
                >

                    {/* 검색창 */}
                    <div className="search-wrap">

                        <FormControl
                            placeholder="스터디를 검색해보세요"
                            className="search-input"
                        />

                        {/* 검색창 내부 */}
                        <div className="search-inner">

                            {/* 검색 아이콘 */}
                            <Button
                                variant="light"
                                size="sm"
                                className="icon-button"
                            >
                                <FiSearch />
                            </Button>

                            {/* 지역 */}
                            <Dropdown>

                                <Dropdown.Toggle
                                    variant="light"
                                    size="sm"
                                    className="dropdown-button"
                                >
                                    지역
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item>
                                        서울
                                    </Dropdown.Item>

                                    <Dropdown.Item>
                                        경기
                                    </Dropdown.Item>

                                    <Dropdown.Item>
                                        부산
                                    </Dropdown.Item>
                                </Dropdown.Menu>

                            </Dropdown>

                            {/* 분야 */}
                            <Dropdown>

                                <Dropdown.Toggle
                                    variant="light"
                                    size="sm"
                                    className="dropdown-button"
                                >
                                    분야
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item>
                                        개발
                                    </Dropdown.Item>

                                    <Dropdown.Item>
                                        자격증
                                    </Dropdown.Item>

                                    <Dropdown.Item>
                                        외국어
                                    </Dropdown.Item>
                                </Dropdown.Menu>

                            </Dropdown>

                        </div>

                    </div>

                    {/* 메뉴 */}
                    <Nav className="header-menu">

                        <Button
                            variant="light"
                            size="sm"
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

                        <FiUser
                            size={20}
                            className="header-icon"
                        />

                    </Nav>

                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
}

export default Header;