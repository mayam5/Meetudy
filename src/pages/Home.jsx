/*
  [수정 사항]
  1. 디자인 리뉴얼 - 히어로 섹션, 마퀴 애니메이션 추가
  2. useNavigate 선언 누락 수정
  3. JSX 안 주석 오류(/*) 전부 제거
  4. 중복된 all-study-section 하나로 통합
  5. 추천 스터디 하드코딩 → posts 데이터 연결
  6. useLocation needLogin 알림 활성화
  7. 불필요한 import 정리 (ALL_STUDIES, InterestSection, FIELDS, Button)
  8. 백엔드 연동 포인트: fetch URL 상수로 분리
*/

import "./Home.css";
import StudyCard from "../components/StudyCard";
import StudyListItem from "../components/StudyListItem";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// ✅ 백엔드 URL 변경 시 여기만 수정
const API_BASE = "http://localhost:8080";

const MARQUEE_ITEMS = [
    { text: "개발", highlight: true },
    { text: "디자인", highlight: false },
    { text: "언어", highlight: false },
    { text: "자격증", highlight: false },
    { text: "취업", highlight: true },
    { text: "알고리즘", highlight: false },
    { text: "토익", highlight: false },
    { text: "리액트", highlight: true },
    { text: "포트폴리오", highlight: false },
    { text: "공무원", highlight: false },
];

function Home() {
    const navigate = useNavigate();
    const location = useLocation();

    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const [hoveredField, setHoveredField] = useState(null);
    const [isHovering, setIsHovering] = useState(false);
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);


    const filteredStudies =
        isHovering && hoveredField
            ? posts.filter((s) => s.field === hoveredField)
            : [];

    useEffect(() => {
        // ✅ 백엔드 연동 - 게시글 목록
        fetch(`${API_BASE}/posts`)
            .then((res) => res.json())
            .then((result) => {
                const mappedPosts = result.data.map((post) => ({
                    id: post.postId,
                    title: post.postTitle,
                    host: post.nickname,
                    field: post.categoryName,
                    users: [post.nickname],
                }));
                setPosts(mappedPosts);
            })
            .catch((error) => {
                console.error("홈 게시글 불러오기 실패:", error);
            });

        // ✅ 백엔드 연동 - 카테고리 목록
        fetch(`${API_BASE}/categories`)
            .then((res) => res.json())
            .then((result) => {
                setCategories(result.data);
            })
            .catch((error) => {
                console.error("홈 카테고리 불러오기 실패:", error);
            });
    }, []);

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

            {/* ===== HERO ===== */}
            <div className="hero-section">
                <div className="hero-blue-line" />
                <div className="hero-tag">
                    <span className="hero-tag-dot" />
                    STUDY PLATFORM
                </div>
                <h1 className="main-title">
                    공부는 혼자보다<br />
                    <span className="accent">같이</span>할 때<br />
                    <span className="scratch">다르다</span>
                </h1>
                <p className="hero-sub">
                    나에게 맞는 스터디를 찾고,<br />
                    함께 성장하는 경험을 시작해보세요.
                </p>
                <div className="button-group">
                    <button
                        className="btn-hero-primary"
                        onClick={() => navigate("/post-write")}
                    >
                        스터디 시작하기
                    </button>
                    <button
                        className="btn-hero-secondary"
                        onClick={() => navigate("/whole-list")}
                    >
                        둘러보기 →
                    </button>
                </div>
            </div>

            {/* ===== MARQUEE ===== */}
            <div className="marquee-wrap">
                <div className="marquee-inner">
                    {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                        <span
                            key={i}
                            className={`marquee-item ${item.highlight ? "highlight" : ""}`}
                        >
                            {item.text}
                            <span className="marquee-dot" />
                        </span>
                    ))}
                </div>
            </div>

            {/* ===== 관심 분야 ===== */}
            <div
                className="interest-section"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => {
                    setIsHovering(false);
                    setHoveredField(null);
                }}
            >
                <div className="section-label">CATEGORY</div>
                <h3 className="interest-title">
                    어떤 스터디를 찾고있나요?
                </h3>
                <p className="interest-sub">관심있는 분야를 선택해보세요!</p>

                <div className="interest-buttons">
                    {/* ✅ 백엔드 연동 - categories API */}
                    {categories.map((category) => (
                        <button
                            key={category.categoryId}
                            className={`cat-btn ${hoveredField === category.categoryName ? "on" : ""}`}
                            onMouseEnter={() => setHoveredField(category.categoryName)}
                        >
                            {category.categoryName}
                        </button>
                    ))}
                </div>

                <div className={`study-list hover-list ${hoveredField ? "open" : ""}`}>
                    {filteredStudies.map((study, index) => (
                        <StudyListItem
                            key={study.id ?? index}
                            id={study.id}
                            title={study.title}
                            host={study.host}
                            field={study.field}
                            users={study.users}
                        />
                    ))}
                </div>
            </div>

            {/* ===== 스터디 생성 유도 ===== */}
            <div className="create-study-box">
                <div className="create-study-text">
                    <h6 className="create-study-title">아직 마음에 드는 스터디가 없나요?</h6>
                    <h6 className="create-study-sub">직접 만들어보세요!</h6>
                </div>
                <div className="create-study-right">
                    <span className="create-study-pill">✦ 30초면 완성</span>
                    <button
                        className="create-study-button"
                        onClick={() => navigate("/post-write")}
                    >
                        스터디 만들기 →
                    </button>
                </div>
            </div>

            {/* ===== 추천 스터디 ===== */}
            <div className="recommend-section">
                <div className="recommend-header">
                    <div className="recommend-text">
                        <div className="section-label">RECOMMENDED</div>
                        <h5 className="recommend-title">추천 스터디 모임</h5>
                        <h6 className="recommend-sub">
                            관심 분야 및 선호 위치를 기반으로 추천이 제공됩니다.
                        </h6>
                    </div>
                    <span
                        className="recommend-more"
                        onClick={() => navigate("/whole-list")}
                    >
                        전체보기 →
                    </span>
                </div>
                {/* ✅ 백엔드 연동 - posts 앞 3개 추천으로 표시 */}
                <div className="card-wrap">
                    {posts.slice(0, 3).map((study, index) => (
                        <StudyCard
                            key={study.id ?? index}
                            id={study.id}
                            title={study.title}
                            host={study.host}
                            field={study.field}
                            users={study.users}
                        />
                    ))}
                </div>
            </div>

            {/* ===== 전체 스터디 목록 ===== */}
            <div className="all-study-section">
                <div className="all-study-header">
                    <div>
                        <div className="section-label">ALL STUDIES</div>
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
                {/* ✅ 백엔드 연동 - posts API */}
                <div className="study-list">
                    {posts.slice(0, 5).map((study, index) => (
                        <StudyListItem
                            key={study.id ?? index}
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