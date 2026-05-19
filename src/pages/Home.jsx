import { Button } from "react-bootstrap";

function Home() {
    return (
        <main style={{ paddingTop: "100px", textAlign: "center" }}>
            <h2 style={{ fontWeight: "bold" }}>함께 공부할 사람을 찾고있나요?</h2>

            <div
                style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "20px",
                    justifyContent: "center"
                }}
            >

                <Button
                    variant="dark"
                    size="sm"
                    style={{
                        width: "200px"
                    }}
                >
                    스터디 시작하기
                </Button>

                <Button
                    variant="dark"
                    size="sm"
                    style={{
                        width: "200px"
                    }}
                >
                    스터디 찾기
                </Button>
            </div>

            <div style={{ margin: "100px", marginBottom: "0px", textAlign: "center", background: "#bababa", padding: "20px", borderRadius: "20px" }}>
                <h3 style={{ fontWeight: "bold" }}>어떤 스터디를 찾고있나요?</h3>
                <h6>관심있는 분야를 선택해보세요!</h6>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                        marginTop: "15px",
                        flexWrap: "wrap"
                    }}
                >
                    <Button variant="light"
                        style={{
                            width: "100px"
                        }}
                    >개발</Button>
                    <Button variant="light"
                        style={{
                            width: "100px"
                        }}>디자인</Button>
                    <Button variant="light"
                        style={{
                            width: "100px"
                        }}>언어</Button>
                    <Button variant="light"
                        style={{
                            width: "100px"
                        }}>자격증</Button>
                    <Button variant="light"
                        style={{
                            width: "100px"
                        }}>취업</Button>
                </div>
            </div>

            <div
                style={{
                    marginLeft: "20px",
                    marginRight: "20px",
                    marginTop: "100px",
                    background: "#000000",
                    padding: "10px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                    borderRadius: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <div
                    style={{
                        textAlign: "left",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}
                >
                    <h6 style={{ fontWeight: "bold", margin: 0 }}>
                        아직 마음에 드는 스터디가 없나요?
                    </h6>

                    <h6 style={{ fontSize: "15px", margin: 0 }}>
                        직접 만들어보세요!
                    </h6>
                </div>

                <Button
                    variant="link"
                    size="sm"
                    style={{
                        textDecoration: "none",
                        color: "white"
                    }}
                >
                    &gt;&gt;click
                </Button>
            </div>

            <div style={{ padding: "20px", textAlign: "left", background: "#efefef"}}>
                <h5 style={{ fontWeight: "bold"}}>
                    추천 스터디 모임
                </h5>
                <h6>관심 분야 및 선호 위치를 기반으로 추천이 제공됩니다.</h6>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "20px",
                        flexWrap: "wrap"
                    }}
                >
                    {/* 카드 1 */}
                    <div
                        style={{
                            width: "250px",
                            background: "white",
                            borderRadius: "15px",
                            padding: "15px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            textAlign: "left"
                        }}
                    >
                        <h5 style={{ fontWeight: "bold" }}>React 스터디</h5>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                            프론트엔드 함께 공부해요
                        </p>
                        <Button size="sm" variant="dark">참여하기</Button>
                    </div>

                    {/* 카드 2 */}
                    <div
                        style={{
                            width: "250px",
                            background: "white",
                            borderRadius: "15px",
                            padding: "15px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            textAlign: "left"
                        }}
                    >
                        <h5 style={{ fontWeight: "bold" }}>영어 회화 스터디</h5>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                            매일 30분 회화 연습
                        </p>
                        <Button size="sm" variant="dark">참여하기</Button>
                    </div>

                    {/* 카드 3 */}
                    <div
                        style={{
                            width: "250px",
                            background: "white",
                            borderRadius: "15px",
                            padding: "15px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            textAlign: "left"
                        }}
                    >
                        <h5 style={{ fontWeight: "bold" }}>취업 준비 스터디</h5>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                            자소서 + 면접 준비
                        </p>
                        <Button size="sm" variant="dark">참여하기</Button>
                    </div>
                </div>
            </div>

        </main>
    );
}

export default Home;