import React, { useState, useEffect } from 'react';
import './MyPage.css';
import StudyListItem from '../components/StudyListItem';
import HostInfo from "../components/HostInfo";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import {
  fetchMyProfile,
  updateMyProfile,
  changePassword,
  fetchBlockedUsers,
  toggleBlockUser,
  fetchBookmarks,
  toggleBookmark,
  fetchMySchedules,
  updateSchedule,
} from "../api/user";
import {
  fetchJoinedStudies,
  fetchAppliedStudies,
  fetchMyStudies,
} from "../api/study";

const API_BASE = "http://localhost:8080";

const REGION_DATA = {
  "서울특별시": {
    "강남구": ["역삼동", "삼성동", "대치동", "논현동"],
    "서초구": ["서초동", "반포동", "잠원동"],
    "마포구": ["서교동", "합정동", "연남동", "상암동"],
    "송파구": ["잠실동", "신천동", "가락동"],
    "영등포구": ["여의도동", "당산동", "영등포동"],
  },
  "경기도": {
    "성남시": ["분당구", "중원구", "수정구"],
    "수원시": ["장안구", "권선구", "팔달구", "영통구"],
    "고양시": ["일산동구", "일산서구", "덕양구"],
    "용인시": ["수지구", "기흥구", "처인구"],
    "부천시": ["원미구", "소사구", "오정구"],
  },
  "인천광역시": {
    "남동구": ["구월동", "간석동", "논현동"],
    "부평구": ["부평동", "삼산동", "산곡동"],
    "연수구": ["송도동", "연수동", "옥련동"],
  },
  "부산광역시": {
    "해운대구": ["우동", "좌동", "중동"],
    "부산진구": ["부전동", "전포동", "양정동"],
    "남구": ["대연동", "용호동", "문현동"],
  },
  "대구광역시": {
    "수성구": ["범어동", "황금동", "만촌동"],
    "달서구": ["월성동", "상인동", "이곡동"],
  },
  "대전광역시": {
    "서구": ["둔산동", "월평동", "관저동"],
    "유성구": ["봉명동", "궁동", "노은동"],
  },
  "광주광역시": {
    "북구": ["운암동", "용봉동", "문흥동"],
    "서구": ["치평동", "상무지구", "금호동"],
  },
};

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const TIMES = ['새벽', '아침', '오후', '저녁'];
const MEETING_TABS = ['참여 중인 모임', '신청한 모임', '작성한 모임'];

// 백엔드 dayOfWeek(MON...) + slotName(새벽...) → "월-새벽" 변환
const DAY_TO_KR = { MON: '월', TUE: '화', WED: '수', THU: '목', FRI: '금', SAT: '토', SUN: '일' };

const MEETING_TAB_FETCHER = {
  "참여 중인 모임": fetchJoinedStudies,
  "신청한 모임": fetchAppliedStudies,
  "작성한 모임": fetchMyStudies,
};

function MyPage() {
  const { isLoggedIn } = useAuth();

  const [isEdit, setIsEdit] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [scheduleEdit, setScheduleEdit] = useState(false);
  const [activeMeetingTab, setActiveMeetingTab] = useState('참여 중인 모임');
  const [meetingStudies, setMeetingStudies] = useState([]);
  const [meetingLoading, setMeetingLoading] = useState(false);

  const [region, setRegion] = useState({ sido: "", sigungu: "", dong: "" });
  const [activeSchedule, setActiveSchedule] = useState([]);
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [userInfo, setUserInfo] = useState({
    email: "", nickname: "", birth: "2000-01-01",
    gender: "F", bio: "", categories: [], agePublic: false,
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [bookmarkData, setBookmarkData] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 프로필 / 북마크 / 차단 / 카테고리 / 스케줄 초기 로드
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [profile, bookmarks, blocked, categoryRes, schedules] = await Promise.all([
          fetchMyProfile(),
          fetchBookmarks(),
          fetchBlockedUsers(),
          fetch(`${API_BASE}/categories`).then((r) => r.json()),
          fetchMySchedules(),
        ]);

        setUserInfo({
          email:      profile.email      ?? "",
          nickname:   profile.nickname   ?? "",
          birth:      profile.birth      ?? "2000-01-01",
          gender:     profile.gender     ?? "F",
          bio:        profile.bio        ?? "",
          categories: profile.categories ?? [],
          agePublic:  profile.agePublic  ?? false,
        });
        if (profile.profileImage) setProfileImage(profile.profileImage);

        setBookmarkData(bookmarks);
        setBookmarkedIds(bookmarks.map((b) => b.id));
        setBlockedUsers(blocked);
        setCategoryOptions((categoryRes.data ?? []).map((c) => c.categoryName));

        // 스케줄: ScheduleResponse[] → ["월-새벽", "화-오전", ...] 변환
        const scheduleList = Array.isArray(schedules) ? schedules : [];
        const converted = scheduleList
          .map((s) => {
            const dayKr = DAY_TO_KR[s.dayOfWeek];
            const timeKr = s.slotName; // 백엔드 slotName이 "새벽"/"오전"/"오후"/"저녁" 이면 그대로
            return dayKr && timeKr ? `${dayKr}-${timeKr}` : null;
          })
          .filter(Boolean);
        setActiveSchedule(converted);
      } catch (e) {
        console.error("마이페이지 데이터 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // 모임 탭 변경 시 데이터 로드
  useEffect(() => {
    const load = async () => {
      setMeetingLoading(true);
      try {
        const fetcher = MEETING_TAB_FETCHER[activeMeetingTab];
        const result = await fetcher({ page: 1, limit: 20 });
        setMeetingStudies(result.data ?? []);
      } catch (e) {
        console.error("모임 데이터 로드 실패:", e);
      } finally {
        setMeetingLoading(false);
      }
    };
    load();
  }, [activeMeetingTab]);

  const calculateAge = (birth) => {
    const today = new Date();
    const birthDate = new Date(birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const toggleCategory = (item) => {
    if (!isEdit) return;
    const exists = userInfo.categories.includes(item);
    setUserInfo({
      ...userInfo,
      categories: exists
        ? userInfo.categories.filter((v) => v !== item)
        : [...userInfo.categories, item],
    });
  };

  const toggleSchedule = (key) => {
    if (!scheduleEdit) return;
    setActiveSchedule((prev) =>
      prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    try {
      await updateMyProfile({ ...userInfo, region });
    } catch (e) {
      console.error("프로필 저장 실패:", e);
      alert("프로필 저장에 실패했습니다.");
      return;
    }
    setIsEdit(false);
  };

  const handlePasswordChange = async () => {
    if (password.new !== password.confirm) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }
    try {
      await changePassword({ current: password.current, newPassword: password.new });
      alert("비밀번호가 변경되었습니다.");
      setPassword({ current: "", new: "", confirm: "" });
    } catch (e) {
      console.error("비밀번호 변경 실패:", e);
      alert("비밀번호 변경에 실패했습니다.");
    }
  };

  // toggleBookmark: 현재 북마크 상태를 함께 전달 (DELETE vs POST 결정)
  const handleToggleBookmark = async (itemId) => {
    const isCurrentlyBookmarked = bookmarkedIds.includes(itemId);
    try {
      await toggleBookmark(itemId, isCurrentlyBookmarked);
      if (isCurrentlyBookmarked) {
        setBookmarkedIds((prev) => prev.filter((id) => id !== itemId));
        setBookmarkData((prev) => prev.filter((b) => b.id !== itemId));
      } else {
        setBookmarkedIds((prev) => [...prev, itemId]);
      }
    } catch (e) {
      console.error("북마크 토글 실패:", e);
    }
  };

  const handleToggleBlock = async (userId, currentBlocked) => {
    try {
      await toggleBlockUser(userId, !currentBlocked);
      setBlockedUsers((prev) =>
        prev.map((u) => u.id === userId ? { ...u, blocked: !u.blocked } : u)
      );
    } catch (e) {
      console.error("차단 토글 실패:", e);
    }
  };

  if (loading) {
    return <div className="mypage-loading">불러오는 중...</div>;
  }

  return (
    <div className={isEdit ? "mypage editing" : "mypage"}>

      {/* ===== 왼쪽 ===== */}
      <div className="left-section">

        {/* 프로필 카드 */}
        <div className="card profile-card">
          {isEdit ? (
            <input
              className="edit-input nickname-input"
              value={userInfo.nickname}
              onChange={(e) => setUserInfo({ ...userInfo, nickname: e.target.value })}
            />
          ) : (
            <h2 className="nickname">{userInfo.nickname}</h2>
          )}

          <div className="profile-image">
            {profileImage ? (
              <img src={profileImage} alt="프로필" className="profile-img" />
            ) : (
              <div className="profile-placeholder" />
            )}
          </div>

          <div className="profile-info">
            <div className="info-row">
              <span className="label">나이</span>
              <span className="value">
                {userInfo.birth ? `${calculateAge(userInfo.birth)}세` : "-"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">성별</span>
              {isEdit ? (
                <select
                  className="edit-input"
                  value={userInfo.gender}
                  onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })}
                >
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                </select>
              ) : (
                <span className="value">{userInfo.gender === "M" ? "남성" : "여성"}</span>
              )}
            </div>
            <div className="info-row">
              <span className="label">나이 공개</span>
              {isEdit ? (
                <input
                  type="checkbox"
                  checked={userInfo.agePublic}
                  onChange={(e) => setUserInfo({ ...userInfo, agePublic: e.target.checked })}
                />
              ) : (
                <span className="value">{userInfo.agePublic ? "공개" : "비공개"}</span>
              )}
            </div>
            <div className="info-row">
              <span className="label">지역</span>
              {isEdit ? (
                <div className="region-selects">
                  <select
                    className="edit-input"
                    value={region.sido}
                    onChange={(e) => setRegion({ sido: e.target.value, sigungu: "", dong: "" })}
                  >
                    <option value="">시/도</option>
                    {Object.keys(REGION_DATA).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    className="edit-input"
                    value={region.sigungu}
                    onChange={(e) => setRegion({ ...region, sigungu: e.target.value, dong: "" })}
                  >
                    <option value="">시/군/구</option>
                    {region.sido && Object.keys(REGION_DATA[region.sido]).map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <select
                    className="edit-input"
                    value={region.dong}
                    onChange={(e) => setRegion({ ...region, dong: e.target.value })}
                  >
                    <option value="">읍/면/동</option>
                    {region.sido && region.sigungu &&
                      REGION_DATA[region.sido][region.sigungu].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                  </select>
                </div>
              ) : (
                <span className="value">
                  {region.sido && region.sigungu && region.dong
                    ? `${region.sido} ${region.sigungu} ${region.dong}`
                    : "-"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 한 줄 소개 */}
        <div className="card bio-card">
          <div className="quote">"</div>
          {isEdit ? (
            <textarea
              className="bio-textarea"
              value={userInfo.bio}
              onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
              placeholder="한 줄 소개를 입력하세요"
            />
          ) : (
            <p>{userInfo.bio || "소개가 없습니다."}</p>
          )}
          <div className="quote right">"</div>
        </div>

        {/* 카테고리 */}
        <div className="card category-card">
          <h3>Category</h3>
          <div className="tag-wrapper">
            {categoryOptions.map((item) => (
              <div
                key={item}
                className={userInfo.categories.includes(item) ? 'tag active-tag' : 'tag'}
                onClick={() => toggleCategory(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <button
          className="edit-btn"
          onClick={() => isEdit ? handleSave() : setIsEdit(true)}
        >
          {isEdit ? '저장하기' : '내 정보 수정'}
        </button>
      </div>

      {/* ===== 오른쪽 ===== */}
      <div className="right-section">

        {/* 계정 보안 — 편집 모드에서만 표시 */}
        {isEdit && (
          <div className="card password-card">
            <h3>계정 보안</h3>
            <input className="edit-input" value={userInfo.email} readOnly placeholder="이메일" />
            <input
              type="password" placeholder="현재 비밀번호"
              value={password.current} className="edit-input"
              onChange={(e) => setPassword({ ...password, current: e.target.value })}
            />
            <input
              type="password" placeholder="새 비밀번호"
              value={password.new} className="edit-input"
              onChange={(e) => setPassword({ ...password, new: e.target.value })}
            />
            <input
              type="password" placeholder="새 비밀번호 확인"
              value={password.confirm} className="edit-input"
              onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
            />
            <button className="small-btn" onClick={handlePasswordChange}>변경하기</button>
          </div>
        )}

        {/* 스케줄 + 북마크 */}
        <div className="top-row">

          {/* 스케줄 */}
          <div className={scheduleEdit ? 'card schedule-card editing' : 'card schedule-card'}>
            <div className="card-header">
              <h3>Schedule</h3>
              <button
                className={scheduleEdit ? 'small-btn active-edit-btn' : 'small-btn'}
                onClick={async () => {
                  if (scheduleEdit) {
                    try {
                      await updateSchedule(activeSchedule);
                    } catch (e) {
                      console.error("스케줄 저장 실패:", e);
                      alert("스케줄 저장에 실패했습니다.");
                    }
                  }
                  setScheduleEdit(!scheduleEdit);
                }}
              >
                {scheduleEdit ? '저장' : '수정'}
              </button>
            </div>
            <div className="schedule-grid">
              {DAYS.map((day) => <div key={day}>{day}</div>)}
              {TIMES.map((time) => (
                <React.Fragment key={time}>
                  {DAYS.map((day) => {
                    const key = `${day}-${time}`;
                    const isActive = activeSchedule.includes(key);
                    return (
                      <div
                        key={key}
                        className={isActive ? 'active schedule-cell' : 'schedule-cell'}
                        onClick={() => toggleSchedule(key)}
                      >
                        {time}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 북마크 */}
          <div className="card bookmark-card">
            <h3>Bookmark</h3>
            <div className="bookmark-list">
              {bookmarkData.length === 0 ? (
                <div className="meeting-empty">북마크한 모임이 없어요</div>
              ) : (
                bookmarkData.map((item) => (
                  <div className="bookmark-item" key={item.id}>
                    <div
                      className="bookmark-icon"
                      onClick={() => handleToggleBookmark(item.id)}
                    >
                      {bookmarkedIds.includes(item.id)
                        ? <BsBookmarkFill />
                        : <BsBookmark />}
                    </div>
                    <div className="bookmark-content">
                      <StudyListItem
                        id={item.id}
                        title={item.title}
                        host={item.host}
                        field={item.field}
                        users={item.users ?? []}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 모임 관리 */}
        <div className="card meeting-card">
          <div className="meeting-card-header">
            <h3>모임 관리</h3>
            <div className="meeting-tabs">
              {MEETING_TABS.map((tab) => (
                <span
                  key={tab}
                  className={activeMeetingTab === tab ? 'active-tab' : ''}
                  onClick={() => setActiveMeetingTab(tab)}
                >
                  {tab}
                </span>
              ))}
            </div>
          </div>

          <div className="meeting-list">
            {meetingLoading ? (
              <div className="meeting-loading">불러오는 중...</div>
            ) : meetingStudies.length === 0 ? (
              <div className="meeting-empty">해당 모임이 없어요</div>
            ) : (
              meetingStudies.map((study) => (
                <StudyListItem
                  key={study.id}
                  id={study.id}
                  title={study.title}
                  host={study.host}
                  field={study.field}
                  users={study.users ?? []}
                />
              ))
            )}
          </div>
        </div>

        {/* Study Log + 사용자 관리 */}
        <div className="bottom-row">

          {/* Study Log */}
          <div className="card study-card">
            <div className="card-header">
              <div>
                <h3>Study Log</h3>
                <p className="sub-text">일주일동안 이만큼 공부했어요!</p>
              </div>
              <button className="small-btn" onClick={() => alert("수정 기능 준비 중")}>
                수정
              </button>
            </div>
            <div className="time-text">13H<br />06M</div>
          </div>

          {/* 사용자 관리 */}
          <div className="card user-card">
            <h3>사용자 관리</h3>
            {blockedUsers.length === 0 ? (
              <div className="meeting-empty">차단한 사용자가 없어요</div>
            ) : (
              blockedUsers.map((user) => (
                <div className="user-item" key={user.id}>
                  <HostInfo host={user.host} field={user.field} />
                  <button
                    className={user.blocked
                      ? "small-btn user-action-btn blocked"
                      : "small-btn user-action-btn"
                    }
                    onClick={() => handleToggleBlock(user.id, user.blocked)}
                  >
                    {user.blocked ? "차단 해제" : "차단하기"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default MyPage;