import { Button } from "react-bootstrap";
import "./Home.css";
import StudyCard from "../components/StudyCard";
import StudyListItem from "../components/StudyListItem";
import InterestSection from "../components/InterestSection";
import { useNavigate } from "react-router-dom";
import { ALL_STUDIES } from "../data/dummyData";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";


const FIELDS = ["개발", "디자인", "언어", "자격증", "취업"];

function Home() {
    const location = useLocation();
    const [showLoginAlert, setShowLoginAlert] = useState(false);

    useEffect(() => {
        if (location.state?.needLogin) {
            setShowLoginAlert(true);
            setTimeout(() => setShowLoginAlert(false), 3000);
        }
    }, [location]);

    return (
        <main className="home">
            {/* 로그인 필요 알림 */}
            {showLoginAlert && (
                <div className="login-alert">
                    로그인이 필요한 서비스입니다.
                </div>
            )}
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
                    onClick={() => navigate("/post-write")}
                >
                    스터디 시작하기
                </Button>
                <Button
                    variant="dark"
                    size="sm"
                    style={{ width: "200px" }}
                    onClick={() => navigate("/whole-list")}
                >
                    스터디 찾기
                </Button>
            </div>

            {/* 관심 분야 - InterestSection 컴포넌트 사용 */}
            <div style={{ width: "80%", margin: "100px auto 0" }}>
                <InterestSection allStudies={ALL_STUDIES} />
            </div>

            {/* 스터디 생성 유도 */}
            <div className="create-study-box">
                <div className="create-study-text">
                    <h6 className="create-study-title">아직 마음에 드는 스터디가 없나요?</h6>
                    <h6 className="create-study-sub">직접 만들어보세요!</h6>
                </div>
                <Button
                    variant="link"
                    size="sm"
                    className="create-study-button"
                    onClick={() => navigate("/post-write")}
                >
                    스터디 만들기 →
                </Button>
            </div>

            {/* 추천 스터디 */}
            <div className="recommend-section">
                <div className="recommend-text">
                    <h5 className="recommend-title">추천 스터디 모임</h5>
                    <h6 className="recommend-sub">
                        관심 분야 및 선호 위치를 기반으로 추천이 제공됩니다.
                    </h6>
                </div>
                <div className="card-wrap">
                    {ALL_STUDIES.slice(0, 3).map((study) => (
                        <StudyCard
                            key={study.id}
                            id={study.id}
                            title={study.title}
                            host={study.host}
                            field={study.field}
                            users={study.users}
                        />
                    ))}
                </div>
            </div>

            {/* 전체 스터디 목록 */}
            <div className="all-study-section">
                <div className="all-study-header">
                    <div>
                        <h5 className="all-study-title">전체 스터디 목록</h5>
                        <h6 className="all-study-sub">현재 모집 중인 스터디를 확인해보세요.</h6>
                    </div>
                    <span
                        className="all-study-more"
                        onClick={() => navigate("/whole-list")}
                    >
                        더보기 →
                    </span>
                </div>
                <div className="study-list">
                    {ALL_STUDIES.slice(0, 5).map((study) => (
                        <StudyListItem
                            key={study.id}
                            id={study.id}
                            title={study.title}
                            host={study.host}
                            field={study.field}
                            users={study.users}
                        />
                    ))}
                </div>
            </div>

        </main>
    );
}

export default Home;