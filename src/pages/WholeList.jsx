import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import WholeListItem from "../components/WholeListItem";
import Dropbox from "../components/Dropbox";
import Pagination from "react-bootstrap/Pagination";
import "./WholeList.css";

import {
  fetchAllStudies,
  fetchMyStudies,
  fetchJoinedStudies,
  fetchAppliedStudies,
  fetchBookmarkedStudies,
  deleteStudy,
  cancelApplication,
} from "../api/study";

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

const getTabFetcher = (tab) => {
  const map = {
    "내가 작성한 모임": fetchMyStudies,
    "전체 모임": fetchAllStudies,
    "참여 중인 모임": fetchJoinedStudies,
    "신청한 모임": fetchAppliedStudies,
    "북마크": fetchBookmarkedStudies,
  };

  return map[tab] ?? fetchAllStudies;
};

const FILTER_TABS = ["전체 모임", "북마크"];
const STUDIES_PER_PAGE = 10;

function WholeList() {
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState("전체 모임");
  const [category, setCategory] = useState(searchParams.get("field") || "");
  const [region, setRegion] = useState(searchParams.get("region") || "");
  const [searchValue] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(1);

  const [studies, setStudies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalPages = Math.ceil(totalCount / STUDIES_PER_PAGE);
  const showFilters = FILTER_TABS.includes(activeTab);

  const loadStudies = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetcher = getTabFetcher(activeTab);

      const result = await fetcher({
        search: searchValue,
        region,
        field: category,
        page: currentPage,
        limit: STUDIES_PER_PAGE,
      });

      setStudies(result.data);
      setTotalCount(result.total);
    } catch (e) {
      setError("데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudies();
  }, [activeTab, searchValue, region, category, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setCategory("");
    setRegion("");
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudy(id);
      setStudies((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error("삭제 실패:", e);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelApplication(id);
      setStudies((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error("취소 실패:", e);
    }
  };

  return (
    <div className="whole-page">
      <div className="whole-layout">
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

        <main className="whole-main">
          <div className="whole-main-header">
            <div>
              <h2>{activeTab}</h2>
              <p>{TAB_DESCRIPTIONS[activeTab]}</p>

              {searchValue && (
                <p className="search-keyword">
                  "{searchValue}" 검색 결과 {totalCount}건
                </p>
              )}
            </div>

            {showFilters && (
              <div className="whole-filters">
                <Dropbox
                  placeholder="지역"
                  value={region}
                  onChange={(v) => {
                    setRegion(v);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: "서울", label: "서울" },
                    { value: "부산", label: "부산" },
                    { value: "인천", label: "인천" },
                  ]}
                />

                <Dropbox
                  placeholder="카테고리"
                  value={category}
                  onChange={(v) => {
                    setCategory(v);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: "개발", label: "개발" },
                    { value: "디자인", label: "디자인" },
                    { value: "언어", label: "언어" },
                  ]}
                />
              </div>
            )}
          </div>

          <div className="whole-scroll-area">
            {loading && <div className="whole-status">불러오는 중...</div>}

            {error && <div className="whole-status error">{error}</div>}

            {!loading && !error && studies.length === 0 && (
              <div className="whole-status">목록이 없습니다.</div>
            )}

            {!loading &&
              !error &&
              studies.map((study) => (
                <WholeListItem
                  key={study.id}
                  {...study}
                  type={getItemType(activeTab)}
                  onDelete={() => handleDelete(study.id)}
                  onCancel={() => handleCancel(study.id)}
                  onLeave={() => handleCancel(study.id)}
                />
              ))}
          </div>

          {totalPages > 1 && (
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                />
              </Pagination>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default WholeList;