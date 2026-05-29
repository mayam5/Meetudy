{ /*

  모임 목록 (탭)

  모든 탭마다 지역, 카테고리별 분류 가능

  통일 사항:
  [Bookmark]  [Title]  [Host]  [GroupMember]

  [Bookmark] - 북마크 설정 가능
  [Host] 사용자 프로필 이동
  [GroupMember] 

  1. 내가 작성한 모임 
    - 내가 올린 글만 모아서 -> 북마크, 수정, 삭제 가능
    - 수정 선택 시 -> 해당 게시글 작성 페이지로
    - 삭제 선택 시 -> 삭제되었습니다

  2. 전체 모임 
    - 올라온 모든 글 -> 북마크 가능

  3. 참여 중인 모임 
    - 내가 참여 중인 모임 -> 북마크, 채팅방 이동, 나가기(탈퇴) 가능
    - 채팅방 이동 -> 해당 그룹 채팅방으로
    - 나가기 -> 모임에서 탈퇴되었습니다

  4. 신청한 모임
    - 다른 사람이 올린 글 중 내가 신청한 것 모아서
    -> 북마크, 신청 취소 가능
      - 신청 취소 -> 신청 취소되었습니다
    -> 수락, 거절 상태 표시 -> 수락된 모임은 <참여 중인 모임> 탭에서도 확인 가능

  5. 북마크 
    - 내가 북마크한 게시글 목록 -> 북마크 가능

*/ }

import { useState } from "react";
import WholeListItem from "../components/WholeListItem";
import Dropbox from "../components/Dropbox";
import Pagination from "react-bootstrap/Pagination";
import "./WholeList.css";

const TABS = [
    "내가 작성한 모임",
    "전체 모임",
    "참여 중인 모임",
    "신청한 모임",
    "북마크",
];

const TAB_DESCRIPTIONS = {
    "내가 작성한 모임": "내가 만든 모임을 확인할 수 있습니다.",
    "전체 모임": "현재 진행 중인 스터디",
    "참여 중인 모임": "내가 참여하고 있는 모임입니다.",
    "신청한 모임": "내가 신청한 모임을 확인할 수 있습니다.",
    "북마크": "북마크한 모임을 확인할 수 있습니다.",
};

const getItemType = (tab) => {
    const map = {
        "내가 작성한 모임": "written",
        "전체 모임": "all",
        "참여 중인 모임": "joined",
        "신청한 모임": "applied",
        "북마크": "bookmark",
    };
    return map[tab] ?? "all";
};

/*
const dummyStudies = [
  { title: "Title", host: "닉네임", profileImage: "", users: ["A", "B", "C"] },
  { title: "Title", host: "닉네임", field: "분야", users: ["A", "B", "C"] },
  { title: "Title", host: "닉네임", field: "분야", users: ["A", "B", "C"] },
  { title: "Title", host: "닉네임", field: "분야", users: ["A", "B", "C"] },
  { title: "Title", host: "닉네임", field: "분야", users: ["A", "B", "C"] },
  { title: "Title", host: "닉네임", field: "분야", users: ["A", "B", "C"] },
  { title: "Title", host: "닉네임", field: "분야", users: ["A", "B", "C"] },
  { title: "Title", host: "닉네임", field: "분야", users: ["A", "B", "C"] },
  { title: "Title", host: "닉네임", field: "분야", users: ["A", "B", "C"] },
  { title: "Title", host: "닉네임", field: "분야", users: ["A", "B", "C"] },
  { title: "Title", host: "닉네임", field: "분야", users: ["A", "B", "C"] },
  { title: "Title", host: "닉네임", field: "분야", users: ["A", "B", "C"] },
  { title: "Title", host: "닉네임", field: "분야", users: ["A", "B", "C"] },
  { title: "Title", host: "닉네임", field: "분야", users: ["A", "B", "C"] },
];
*/

const DUMMY_STUDIES = Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    title: `스터디 ${i + 1}`,
    host: "닉네임",
    hostId: 1,
    tags: ["IT", "개발"],
    users: ["A", "B", "C"],
    applicationStatus: i === 1 ? "accepted" : i === 2 ? "rejected" : "pending",
}));

const STUDIES_PER_PAGE = 10;

function WholeList() {
    const [activeTab, setActiveTab] = useState("내가 작성한 모임");
    const [category, setCategory] = useState("");
    const [region, setRegion] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(DUMMY_STUDIES.length / STUDIES_PER_PAGE);
    const currentStudies = DUMMY_STUDIES.slice(
        (currentPage - 1) * STUDIES_PER_PAGE,
        currentPage * STUDIES_PER_PAGE
    );

    return (
        <div className="whole-page">
            <div className="whole-layout">

                {/* 사이드바 */}
                <aside className="whole-sidebar">
                    <h4>☰ 모임 목록</h4>
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            className={`whole-tab ${activeTab === tab ? "active" : ""}`}
                            onClick={() => handleTabChange(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </aside>

                {/* 메인 */}
                <main className="whole-main">
                    <div className="whole-main-header">
                        <div>
                            <h2>{activeTab}</h2>
                            <p>{TAB_DESCRIPTIONS[activeTab]}</p>
                        </div>

                        <div className="whole-filters">
                            <Dropbox
                                placeholder="지역"
                                value={region}
                                onChange={setRegion}
                                options={[
                                    { value: "seoul", label: "서울" },
                                    { value: "busan", label: "부산" },
                                    { value: "incheon", label: "인천" },
                                ]}
                            />
                            <Dropbox
                                placeholder="카테고리"
                                value={category}
                                onChange={setCategory}
                                options={[
                                    { value: "it", label: "IT" },
                                    { value: "design", label: "디자인" },
                                    { value: "language", label: "언어" },
                                ]}
                            />
                        </div>
                    </div>

                    <div className="whole-scroll-area">
                        {currentStudies.map((study) => (
                            <WholeListItem
                                key={study.id}
                                {...study}
                                type={getItemType(activeTab)}
                            />
                        ))}
                    </div>

                    <div className="whole-pagination">
                        <Pagination>
                            <Pagination.Prev
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            />
                            {[...Array(totalPages)].map((_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === currentPage}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            />
                        </Pagination>
                    </div>
                </main>
            </div>

            { /*
            <footer className="whole-footer">
                하단 리소스 영역
            </footer>
            */ }

        </div>
    );
}

export default WholeList;