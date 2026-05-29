import { Button } from "react-bootstrap";
import "./Home.css";
import StudyCard from "../components/StudyCard";
import StudyListItem from "../components/StudyListItem";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ALL_STUDIES = [
    { title: "알고리즘 1", host: "민수", field: "개발", users: ["A", "B"] },
    { title: "알고리즘 2", host: "철수", field: "개발", users: ["A"] },
    { title: "알고리즘 3", host: "영희", field: "개발", users: ["A", "B", "C"] },
    { title: "UIUX 1", host: "수빈", field: "디자인", users: ["A"] },
    { title: "UIUX 2", host: "지훈", field: "디자인", users: ["A", "B"] },
    { title: "토익 1", host: "민지", field: "언어", users: ["A", "B"] },
    { title: "토익 2", host: "준호", field: "언어", users: ["A"] },
    { title: "자격증 1", host: "철수", field: "자격증", users: ["A", "B", "C"] },
    { title: "취업 1", host: "영희", field: "취업", users: ["A"] },
];

const FIELDS = ["개발", "디자인", "언어", "자격증", "취업"];

function Home() {
    const [selectedField, setSelectedField] = useState(null);
    const navigate = useNavigate();

    const filteredStudies = selectedField
        ? ALL_STUDIES.filter((s) => s.field === selectedField)
        : [];

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

            {/* 관심 분야 */}
            <div className="interest-section">
                <h3 className="interest-title">어떤 스터디를 찾고있나요?</h3>
                <h6>관심있는 분야를 선택해보세요!</h6>

                <div className="interest-buttons">
                    {FIELDS.map((field) => (
                        <Button
                            key={field}
                            variant={selectedField === field ? "dark" : "light"}
                            style={{ width: "100px" }}
                            onClick={() =>
                                setSelectedField(selectedField === field ? null : field)
                            }
                        >
                            {field}
                        </Button>
                    ))}
                </div>

                <div className={`study-list hover-list ${selectedField ? "open" : ""}`}>
                    {filteredStudies.map((study) => (
                        <StudyListItem
                            key={study.title}
                            title={study.title}
                            host={study.host}
                            field={study.field}
                            users={study.users}
                        />
                    ))}
                </div>
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
                            key={study.title}
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
                            key={study.title}
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