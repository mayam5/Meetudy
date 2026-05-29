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


    const [hoveredField, setHoveredField] = useState(null);
    const [isHovering, setIsHovering] = useState(false);

    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();



    /* 
    const allStudies = [
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
    */

    const filteredStudies =
    isHovering && hoveredField
        ? posts.filter((s) => s.field === hoveredField)
        : [];



    useEffect(() => {
        fetch("http://localhost:8080/posts")
            .then((res) => res.json())
            .then((result) => {
            const mappedPosts = result.data.map((post) => ({
                title: post.postTitle,
                host: post.nickname,
                field: post.categoryName,
                // users: [{ id: post.userId, name: post.nickname }],
                users: [post.nickname],
            }));

            setPosts(mappedPosts);
            })
            .catch((error) => {
            console.error("홈 게시글 불러오기 실패:", error);
            });

        fetch("http://localhost:8080/categories")
            .then((res) => res.json())
            .then((result) => {
            setCategories(result.data);
            })
            .catch((error) => {
            console.error("홈 카테고리 불러오기 실패:", error);
            });
        }, []);
/*
    useEffect(() => {
        if (location.state?.needLogin) {
            setShowLoginAlert(true);
            setTimeout(() => setShowLoginAlert(false), 3000);
        }
    }, [location]);
*/

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


            {/* 관심 분야 */}
            <div
                className="interest-section"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => {
                    setIsHovering(false);
                    setHoveredField(null);
                }}
            >

                <h3 className="interest-title">
                    어떤 스터디를 찾고있나요?
                </h3>

                <h6>
                    관심있는 분야를 선택해보세요!
                </h6>

                <div className="interest-buttons">

{categories.map((category) => (
  <Button
    key={category.categoryId}
    variant="light"
    style={{ width: "130px" }}
    onMouseEnter={() => setHoveredField(category.categoryName)}
  >
    {category.categoryName}
  </Button>
))}

                </div>

                <div className={`study-list hover-list ${hoveredField ? "open" : ""}`}>

                    {filteredStudies.map((study, index) => (
                        <StudyListItem
                            key={index}
                            title={study.title}
                            host={study.host}
                            field={study.field}
                            users={study.users}
                        />
                    ))}

                </div>


/*
            {/* 관심 분야 - InterestSection 컴포넌트 사용 */}
            <div style={{ width: "80%", margin: "100px auto 0" }}>
                <InterestSection allStudies={ALL_STUDIES} />
*/</div>
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


                    <StudyCard title="스터디" host="닉네임" field="IT" users={["A", "B", "C"]} />
                    <StudyCard title="스터디" host="닉네임" field="IT" users={["A", "B", "C"]} />
                    <StudyCard title="스터디" host="닉네임" field="IT" users={["A", "B", "C"]} />

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

                    {posts.slice(0, 5).map((study, index) => (
                        <StudyListItem
                            key={index}

/*
                    {ALL_STUDIES.slice(0, 3).map((study) => (
                        <StudyCard
                            key={study.id}
                            id={study.id}
*/
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