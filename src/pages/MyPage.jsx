import React, { useState } from 'react';
import './MyPage.css';
import StudyListItem from '../components/StudyListItem';
import HostInfo from "../components/HostInfo";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

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

const CATEGORY_OPTIONS = ['분야1', '분야2', '분야3', '분야4', '분야5'];
const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const TIMES = ['새벽', '오전', '오후', '저녁'];
const MEETING_TABS = ['참여 중인 모임', '참여 승인 대기', '신청한 모임', '작성한 모임'];

const BOOKMARK_DATA = [
    { id: 1, title: "React 스터디", host: "김예빈", field: "개발" },
    { id: 2, title: "토익 스터디", host: "홍길동", field: "외국어" },
    { id: 3, title: "알고리즘 스터디", host: "철수", field: "개발" },
];

const MEETING_DATA = {
    '참여 중인 모임': [
        { title: "React 스터디", host: "김예빈", field: "개발", users: ["A", "B", "C"] },
        { title: "토익 스터디", host: "홍길동", field: "외국어", users: ["A", "B"] },
    ],
    '참여 승인 대기': [
        { title: "SQL 자격증", host: "관리자", field: "자격증", users: ["A", "B", "C", "D"] },
    ],
    '신청한 모임': [
        { title: "알고리즘 스터디", host: "철수", field: "개발", users: ["A"] },
    ],
    '작성한 모임': [
        { title: "UIUX 스터디", host: "나", field: "디자인", users: ["A", "B", "C"] },
    ],
};

function MyPage() {
    const [isEdit, setIsEdit] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [scheduleEdit, setScheduleEdit] = useState(false);
    const [activeMeetingTab, setActiveMeetingTab] = useState('참여 중인 모임');
    const [bookmarkedIds, setBookmarkedIds] = useState([1, 2]);

    const [region, setRegion] = useState({ sido: "", sigungu: "", dong: "" });

    const [activeSchedule, setActiveSchedule] = useState([
        '월-새벽', '화-오전', '목-오후', '토-오후', '일-저녁',
    ]);

    const [blockedUsers, setBlockedUsers] = useState([
        { id: 1, host: "닉네임1", field: "분야", blocked: true },
        { id: 2, host: "닉네임2", field: "분야", blocked: true },
    ]);

    const [password, setPassword] = useState({ current: "", new: "", confirm: "" });

    const [userInfo, setUserInfo] = useState({
        email: localStorage.getItem("userEmail") || "",
        nickname: "Nickname",
        birth: "2000-01-01",
        gender: "F",
        bio: "bio",
        categories: ["분야1", "분야2"],
        agePublic: false,
    });

    const calculateAge = (birth) => {
        const today = new Date();
        const birthDate = new Date(birth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
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

    const handlePasswordChange = () => {
        if (password.new !== password.confirm) {
            alert("비밀번호가 일치하지 않습니다");
            return;
        }
        console.log("비밀번호 변경:", password);
    };

    return (
        <div className={isEdit ? "mypage editing" : "mypage"}>

            {/* 왼쪽 */}
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
                        {profileImage && <img src={profileImage} alt="profile" />}
                        {isEdit && (
                            <label className="small-btn profile-upload-btn">
                                사진 변경
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        setProfileImage(URL.createObjectURL(file));
                                    }}
                                />
                            </label>
                        )}
                    </div>

                    <div className="info-box">
                        {/* AGE */}
                        <div className="info-row">
                            <span className="label">AGE</span>
                            {isEdit ? (
                                <div className="inline-edit">
                                    <input
                                        type="date"
                                        className="edit-input small"
                                        value={userInfo.birth}
                                        onChange={(e) => setUserInfo({ ...userInfo, birth: e.target.value })}
                                    />
                                    <label className="toggle-label">
                                        <input
                                            type="checkbox"
                                            checked={userInfo.agePublic}
                                            onChange={(e) => setUserInfo({ ...userInfo, agePublic: e.target.checked })}
                                        />
                                        공개
                                    </label>
                                </div>
                            ) : (
                                <span className="value">
                                    {userInfo.agePublic ? `${calculateAge(userInfo.birth)}세` : '비공개'}
                                </span>
                            )}
                        </div>

                        {/* GENDER */}
                        <div className="info-row">
                            <span className="label">GENDER</span>
                            {isEdit ? (
                                <select
                                    className="edit-input"
                                    value={userInfo.gender}
                                    onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })}
                                >
                                    <option value="F">F</option>
                                    <option value="M">M</option>
                                </select>
                            ) : (
                                <span className="value">{userInfo.gender}</span>
                            )}
                        </div>

                        {/* REGION */}
                        <div className="info-row">
                            <span className="label">REGION</span>
                            {isEdit ? (
                                <div className="region-select-group">
                                    <select
                                        className="edit-input"
                                        value={region.sido}
                                        onChange={(e) => setRegion({ sido: e.target.value, sigungu: "", dong: "" })}
                                    >
                                        <option value="">시/도</option>
                                        {Object.keys(REGION_DATA).map((sido) => (
                                            <option key={sido} value={sido}>{sido}</option>
                                        ))}
                                    </select>

                                    <select
                                        className="edit-input"
                                        value={region.sigungu}
                                        onChange={(e) => setRegion({ ...region, sigungu: e.target.value, dong: "" })}
                                        disabled={!region.sido}
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
                                        disabled={!region.sigungu}
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

                {/* bio */}
                <div className="card bio-card">
                    <div className="quote">"</div>
                    {isEdit ? (
                        <textarea
                            className="bio-textarea"
                            value={userInfo.bio}
                            onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                        />
                    ) : (
                        <p>{userInfo.bio}</p>
                    )}
                    <div className="quote right">"</div>
                </div>

                {/* category */}
                <div className="card category-card">
                    <h3>Category</h3>
                    <div className="tag-wrapper">
                        {CATEGORY_OPTIONS.map((item) => (
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

                <button className="edit-btn" onClick={() => setIsEdit(!isEdit)}>
                    {isEdit ? '저장' : '내 정보 수정'}
                </button>
            </div>

            {/* 오른쪽 */}
            <div className="right-section">

                {/* 계정 보안 */}
                {isEdit && (
                    <div className="card password-card">
                        <h3>계정 보안</h3>
                        <input className="edit-input" value={userInfo.email} readOnly />
                        <input
                            type="password"
                            placeholder="현재 비밀번호"
                            value={password.current}
                            onChange={(e) => setPassword({ ...password, current: e.target.value })}
                            className="edit-input"
                        />
                        <input
                            type="password"
                            placeholder="새 비밀번호"
                            value={password.new}
                            onChange={(e) => setPassword({ ...password, new: e.target.value })}
                            className="edit-input"
                        />
                        <input
                            type="password"
                            placeholder="새 비밀번호 확인"
                            value={password.confirm}
                            onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                            className="edit-input"
                        />
                        <button className="small-btn" onClick={handlePasswordChange}>
                            변경하기
                        </button>
                    </div>
                )}

                {/* 상단 */}
                <div className="top-row">

                    {/* Schedule */}
                    <div className={scheduleEdit ? 'card schedule-card editing' : 'card schedule-card'}>
                        <div className="card-header">
                            <h3>Schedule</h3>
                            <button
                                className={scheduleEdit ? 'small-btn active-edit-btn' : 'small-btn'}
                                onClick={() => setScheduleEdit(!scheduleEdit)}
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

                    {/* Bookmark */}
                    <div className="card bookmark-card">
                        <h3>Bookmark</h3>
                        <div className="bookmark-list">
                            {BOOKMARK_DATA.map((item) => {
                                const isBookmarked = bookmarkedIds.includes(item.id);
                                return (
                                    <div className="bookmark-item" key={item.id}>
                                        <div
                                            className="bookmark-icon"
                                            onClick={() => {
                                                setBookmarkedIds((prev) =>
                                                    prev.includes(item.id)
                                                        ? prev.filter((id) => id !== item.id)
                                                        : [...prev, item.id]
                                                );
                                            }}
                                        >
                                            {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}
                                        </div>
                                        <div className="bookmark-content">
                                            <StudyListItem
                                                title={item.title}
                                                host={item.host}
                                                field={item.field}
                                                users={["A", "B"]}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 모임 관리 */}
                <div className="card meeting-card">
                    <div className="card-header">
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
                        {MEETING_DATA[activeMeetingTab].map((study) => (
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

                {/* 하단 */}
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
                        {blockedUsers.map((user) => (
                            <div className="user-item" key={user.id}>
                                <HostInfo host={user.host} field={user.field} />
                                <button
                                    className={user.blocked
                                        ? "small-btn user-action-btn blocked"
                                        : "small-btn user-action-btn"
                                    }
                                    onClick={() => {
                                        setBlockedUsers(
                                            blockedUsers.map((u) =>
                                                u.id === user.id ? { ...u, blocked: !u.blocked } : u
                                            )
                                        );
                                    }}
                                >
                                    {user.blocked ? "차단 해제" : "차단하기"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyPage;