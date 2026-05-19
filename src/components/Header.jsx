import {
    Navbar,
    Nav,
    Container,
    FormControl,
    Dropdown,
    Button
} from "react-bootstrap";

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
            className="shadow-sm py-2"
        >
            <Container fluid>

                {/* 로고 */}
                <Navbar.Brand href="#">
                    <img
                        src={logo}
                        alt="logo"
                        style={{
                            width: "120px"
                        }}
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
                    <div
                        className="
                            mx-auto
                            position-relative
                        "
                        style={{
                            width: "100%",
                            maxWidth: "600px",
                            minWidth: "300px"
                        }}
                    >

                        {/* 입력창 */}
                        <FormControl
                            placeholder="스터디를 검색해보세요"
                            size="lg"
                            style={{
                                borderRadius: "999px",
                                paddingRight: "260px",
                                height: "50px"
                            }}
                        />

                        {/* 검색창 내부 요소 */}
                        <div
                            className="
                                position-absolute
                                top-50
                                end-0
                                translate-middle-y
                                d-flex
                                align-items-center
                                gap-2
                                pe-3
                            "
                        >

                            {/* 검색 아이콘 */}
                            <Button
                                variant="light"
                                size="sm"
                                style={{
                                    border: "none",
                                    background: "transparent"
                                }}
                            >
                                <FiSearch />
                            </Button>

                            {/* 지역 */}
                            <Dropdown>

                                <Dropdown.Toggle
                                    variant="light"
                                    size="sm"
                                    style={{
                                        border: "none"
                                    }}
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
                                    style={{
                                        border: "none"
                                    }}
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
                    <Nav
                        className="
                            ms-auto
                            align-items-center
                            gap-3
                            flex-row
                            flex-wrap
                            justify-content-end
                            pt-2
                        "
                    >

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

                        {/* 알림 */}
                        <FiBell
                            size={20}
                            style={{
                                cursor: "pointer"
                            }}
                        />

                        {/* 프로필 */}
                        <FiUser
                            size={20}
                            style={{
                                cursor: "pointer"
                            }}
                        />

                    </Nav>

                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
}

export default Header;