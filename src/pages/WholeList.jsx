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



import { useEffect, useState } from "react";
import Header from "../components/Header";
import WholeListItem from "../components/WholeListItem";
import Dropbox from "../components/Dropbox";
import Pagination from "react-bootstrap/Pagination";
import "./WholeList.css";

const tabs = [
  "내가 작성한 모임",
  "전체 모임",
  "참여 중인 모임",
  "신청한 모임",
  "북마크",
];

const getItemType = (tab) => {
  if (tab === "내가 작성한 모임") return "written";
  if (tab === "전체 모임") return "all";
  if (tab === "참여 중인 모임") return "joined";
  if (tab === "신청한 모임") return "applied";
  if (tab === "북마크") return "bookmark";
};

const tabDescriptions = {
  "내가 작성한 모임": "내가 만든 모임을 확인할 수 있습니다.",
  "전체 모임": "현재 진행 중인 스터디",
  "참여 중인 모임": "내가 참여하고 있는 모임입니다.",
  "신청한 모임": "내가 신청한 모임을 확인할 수 있습니다.",
  "북마크": "북마크한 모임을 확인할 수 있습니다.",
};




/*
const dummyStudies = [
  {
    title: "Title",
    host: "닉네임",
    hostId: 1,
    users: [
      { id: 2, name: "A" },
      { id: 3, name: "B" },
      { id: 4, name: "C" },
    ],
    applicationStatus: "pending",
  },

  {
    title: "Title",
    host: "닉네임",
    hostId: 1,
    users: [
      { id: 2, name: "A" },
      { id: 3, name: "B" },
      { id: 4, name: "C" },
    ],
    applicationStatus: "accepted",
  },

  {
    title: "Title",
    host: "닉네임",
    hostId: 1,
    users: [
      { id: 2, name: "A" },
      { id: 3, name: "B" },
      { id: 4, name: "C" },
    ],
    applicationStatus: "rejected",
  },

  {
    title: "Title",
    host: "닉네임",
    hostId: 1,
    users: [
      { id: 2, name: "A" },
      { id: 3, name: "B" },
      { id: 4, name: "C" },
    ],
    applicationStatus: "pending",
  },

  {
    title: "Title",
    host: "닉네임",
    hostId: 1,
    users: [
      { id: 2, name: "A" },
      { id: 3, name: "B" },
      { id: 4, name: "C" },
    ],
    applicationStatus: "pending",
  },

  {
    title: "Title",
    host: "닉네임",
    hostId: 1,
    users: [
      { id: 2, name: "A" },
      { id: 3, name: "B" },
      { id: 4, name: "C" },
    ],
    applicationStatus: "pending",
  },

  {
    title: "Title",
    host: "닉네임",
    hostId: 1,
    users: [
      { id: 2, name: "A" },
      { id: 3, name: "B" },
      { id: 4, name: "C" },
    ],
    applicationStatus: "pending",
  },

  {
    title: "Title",
    host: "닉네임",
    hostId: 1,
    users: [
      { id: 2, name: "A" },
      { id: 3, name: "B" },
      { id: 4, name: "C" },
    ],
    applicationStatus: "pending",
  },

  {
    title: "Title",
    host: "닉네임",
    hostId: 1,
    users: [
      { id: 2, name: "A" },
      { id: 3, name: "B" },
      { id: 4, name: "C" },
    ],
    applicationStatus: "pending",
  },

  {
    title: "Title",
    host: "닉네임",
    hostId: 1,
    users: [
      { id: 2, name: "A" },
      { id: 3, name: "B" },
      { id: 4, name: "C" },
    ],
    applicationStatus: "pending",
  },

  {
    title: "Title",
    host: "닉네임",
    hostId: 1,
    users: [
      { id: 2, name: "A" },
      { id: 3, name: "B" },
      { id: 4, name: "C" },
    ],
    applicationStatus: "pending",
  },

  
];
*/

function ListPage() {
  const [activeTab, setActiveTab] = useState("내가 작성한 모임");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");

  
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [posts, setPosts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const studiesPerPage = 10;

  const indexOfLast = currentPage * studiesPerPage;
  const indexOfFirst = indexOfLast - studiesPerPage;

  const currentStudies =
    posts.slice(indexOfFirst, indexOfLast);



  useEffect(() => {
    fetch("http://localhost:8080/categories")
      .then((res) => res.json())
      .then((result) => {
        const options = result.data.map((item) => ({
          value: item.categoryId,
          label: item.categoryName,
        }));

        setCategoryOptions(options);
      })
      .catch((error) => {
        console.error("카테고리 불러오기 실패:", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/posts")
      .then((res) => res.json())
      .then((result) => {
        setPosts(result.data);
      })
      .catch((error) => {
        console.error("게시글 불러오기 실패:", error);
      });
  }, []);

  return (
    <div className="whole-page">
      <Header />

      <div className="whole-layout">
        <aside className="whole-sidebar">
          <h4>☰ 모임 목록</h4>

          {tabs.map((tab) => (
            <button
              key={tab}
              className={`whole-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </aside>

        <main className="whole-main">
          <div className="whole-main-header">
            <div>
              <h2>{activeTab}</h2>
              <p>{tabDescriptions[activeTab]}</p>
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
                options={categoryOptions}
              />

            </div>
          </div>

          <div className="whole-scroll-area">
{currentStudies.map((study) => (
  <WholeListItem
    key={study.postId}
    title={study.postTitle}
    host={study.nickname}
    hostId={study.userId}
    users={[
      { id: study.userId, name: study.nickname }
    ]}
    type={getItemType(activeTab)}
    categoryName={study.categoryName}
  />
))}
          </div>

          <div className="whole-pagination">
            <Pagination>

              <Pagination.Prev
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
              />

              {[...Array(Math.ceil(posts.length / studiesPerPage))].map(
                (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                )
              )}

              <Pagination.Next
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(posts.length / studiesPerPage)
                    )
                  )
                }
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

export default ListPage;