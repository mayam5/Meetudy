/*
 * ================================================================
 * [백엔드 전달 사항 - WholeList.jsx 수정 내역]
 * ================================================================
 *
 * 1. API 기본 경로 변경
 *    - 기존: http://localhost:8080/...  (하드코딩)
 *    - 변경: /api/...  (상대경로, 프록시 자동 라우팅)
 *    - 영향 엔드포인트:
 *        GET /api/categories       → { data: [{ categoryName: string }, ...] }
 *        GET /api/regions/cities   → string[]  예) ["서울", "부산", ...]
 *
 * 2. 스터디 목록 조회 쿼리 파라미터
 *    - 모든 탭의 목록 조회 시 아래 파라미터를 전달함 (모두 optional)
 *        search : string   검색어
 *        region : string   지역 필터
 *        field  : string   카테고리 필터
 *        page   : number   현재 페이지 (1부터 시작)
 *        limit  : number   페이지당 항목 수 (현재 고정값 10)
 *    - 응답 형식 필수: { data: Study[], total: number }
 *        data  : 현재 페이지 스터디 목록
 *        total : 전체 항목 수 (페이지네이션 계산용)
 *
 * 3. 삭제
 *    - deleteStudy(id) 호출 → 성공 시 프론트 목록에서 즉시 제거
 *    - 성공 응답: 200 OK (body 불필요)
 *
 * 4. 신청 취소 / 모임 나가기
 *    - onCancel, onLeave 모두 cancelApplication(id) 동일 함수 사용
 *    - 성공 응답: 200 OK (body 불필요)
 *
 * 5. signal 지원 요청 (레이스 컨디션 방지용)
 *    - fetchAllStudies 등 각 fetcher 함수에서
 *      fetch(url, { signal }) 형태로 signal 옵션을 지원해야 함
 *    - 지원 시 빠른 탭 전환 시 이전 요청이 자동 취소됨
 * ================================================================
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
const AUTH_REQUIRED_TABS = ["내가 작성한 모임", "참여 중인 모임", "신청한 모임", "북마크"];
const STUDIES_PER_PAGE = 10;
const API_BASE = "/api";

function WholeList() {
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useAuth();

  // URL 파라미터에서 직접 읽기 (반응형)
  const searchValue = searchParams.get("search") || "";

  const [activeTab, setActiveTab] = useState("전체 모임");
  const [category, setCategory] = useState(searchParams.get("field") || "");
  const [region, setRegion] = useState(searchParams.get("region") || "");
  const [currentPage, setCurrentPage] = useState(1);

  const [studies, setStudies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [regionOptions, setRegionOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  // 진행 중인 요청을 취소하기 위한 ref
  const abortControllerRef = useRef(null);

  const totalPages = Math.ceil(totalCount / STUDIES_PER_PAGE);
  const showFilters = FILTER_TABS.includes(activeTab);

  const loadStudies = useCallback(async () => {
    // 이전 요청이 있으면 취소 (레이스 컨디션 방지)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

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
        signal: controller.signal,
      });
      setStudies(result.data);
      setTotalCount(result.total);
    } catch (e) {
      if (e.name === "AbortError") return; // 취소된 요청은 무시
      setError("데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchValue, region, category, currentPage]);

  useEffect(() => {
    loadStudies();
    return () => abortControllerRef.current?.abort();
  }, [loadStudies]);

  // 검색어 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [categoryRes, regionRes] = await Promise.all([
          fetch(`${API_BASE}/categories`),
          fetch(`${API_BASE}/regions/cities`),
        ]);

        if (!categoryRes.ok || !regionRes.ok) throw new Error("필터 로드 실패");

        const categoryResult = await categoryRes.json();
        const regionResult = await regionRes.json();

        setCategoryOptions(categoryResult.data || []);
        setRegionOptions(regionResult || []);
      } catch (e) {
        console.error("필터 옵션 불러오기 실패:", e);
      }
    };

    loadFilterOptions();
  }, []);

  const handleTabChange = (tab) => {
    // 로그인 필요 탭 접근 차단
    if (AUTH_REQUIRED_TABS.includes(tab) && !isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    setActiveTab(tab);
    setCurrentPage(1);
    setCategory("");
    setRegion("");
    setStudies([]);     // 이전 목록 즉시 비우기
    setTotalCount(0);   // 페이지네이션 깜빡임 방지
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
          <h4>모임 목록</h4>

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
                  options={regionOptions.map((r) => ({ value: r, label: r }))}
                />
                <Dropbox
                  placeholder="카테고리"
                  value={category}
                  onChange={(v) => {
                    setCategory(v);
                    setCurrentPage(1);
                  }}
                  options={categoryOptions.map((c) => ({
                    value: c.categoryName,
                    label: c.categoryName,
                  }))}
                />
              </div>
            )}
          </div>

          <div className="whole-scroll-area">
            {loading && <div className="whole-status">불러오는 중...</div>}

            {!loading && error && (
              <div className="whole-status error">
                {error}
                <br />
                <button className="retry-btn" onClick={loadStudies}>
                  다시 시도
                </button>
              </div>
            )}

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