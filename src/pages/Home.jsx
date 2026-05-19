import { Button } from "react-bootstrap";
import "./Home.css";
import StudyCard from "../components/StudyCard";
import StudyListItem from "../components/StudyListItem";

function Home() {
    return (
        <main className="home">

            {/* 메인 제목 */}
            <h2 className="main-title">
                함께 공부할 사람을 찾고있나요?
            </h2>

            {/* 버튼 영역 */}
            <div className="button-group">

                <Button
                    variant="dark"
                    size="sm"
                    style={{ width: "200px" }}
                >
                    스터디 시작하기
                </Button>

                <Button
                    variant="dark"
                    size="sm"
                    style={{ width: "200px" }}
                >
                    스터디 찾기
                </Button>

            </div>

            {/* 관심 분야 */}
            <div className="interest-section">

                <h3 className="interest-title">
                    어떤 스터디를 찾고있나요?
                </h3>

                <h6>
                    관심있는 분야를 선택해보세요!
                </h6>

                <div className="interest-buttons">

                    <Button variant="light" style={{ width: "100px" }}>
                        개발
                    </Button>

                    <Button variant="light" style={{ width: "100px" }}>
                        디자인
                    </Button>

                    <Button variant="light" style={{ width: "100px" }}>
                        언어
                    </Button>

                    <Button variant="light" style={{ width: "100px" }}>
                        자격증
                    </Button>

                    <Button variant="light" style={{ width: "100px" }}>
                        취업
                    </Button>

                </div>
            </div>

            {/* 스터디 생성 유도 */}
            <div className="create-study-box">

                <div className="create-study-text">

                    <h6 className="create-study-title">
                        아직 마음에 드는 스터디가 없나요?
                    </h6>

                    <h6 className="create-study-sub">
                        직접 만들어보세요!
                    </h6>

                </div>

                <Button
                    variant="link"
                    size="sm"
                    className="create-study-button"
                >
                    &gt;&gt;click
                </Button>

            </div>

            {/* 추천 스터디 */}
            <div className="recommend-section">

                <div className="recommend-text">

                    <h5 className="recommend-title">
                        추천 스터디 모임
                    </h5>

                    <h6 className="recommend-sub">
                        관심 분야 및 선호 위치를 기반으로 추천이 제공됩니다.
                    </h6>

                </div>

                {/* 카드 영역 */}
                <div className="card-wrap">

                    <StudyCard
                        title="스터디"
                        host="닉네임"
                        field="IT"
                        users={["A", "B", "C"]}
                    />

                    <StudyCard
                        title="스터디"
                        host="닉네임"
                        field="IT"
                        users={["A", "B", "C"]}
                    />

                    <StudyCard
                        title="스터디"
                        host="닉네임"
                        field="IT"
                        users={["A", "B", "C"]}
                    />

                </div>
            </div>

            {/* 전체 스터디 목록 */}
            <div className="all-study-section">

                <div className="all-study-text">

                    <h5 className="all-study-title">
                        전체 스터디 목록
                    </h5>

                    <h6 className="all-study-sub">
                        현재 모집 중인 스터디를 확인해보세요.
                    </h6>

                </div>

                <div className="study-list">

                    <StudyListItem
                        title="알고리즘 스터디"
                        host="민수"
                        field="언어"
                        users={["A", "B", "C"]}
                    />

                    <StudyListItem
                        title="토익 900+"
                        host="지훈"
                        field="개발"
                        users={["A", "B", "C"]}
                    />

                    <StudyListItem
                        title="UIUX 포트폴리오"
                        host="수빈"
                        field="디자인"
                        users={["A", "B", "C"]}
                    />

                </div>

            </div>
        </main>
    );
}

export default Home;