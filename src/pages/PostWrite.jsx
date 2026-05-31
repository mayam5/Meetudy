/*
 * PostWrite.jsx
 * ─────────────────────────────────────────────
 * [디자인 변경]
 *   - 전체 디자인 시스템 홈 페이지(블랙/화이트/블루 포인트)에 맞게 리디자인
 *   - 페이지 상단 헤더(라벨 + h1 + 서브타이틀) 추가
 *   - 각 form-section 에 이모지 아이콘 헤더 추가
 *   - tag-item 의 # 을 CSS ::before 로 처리 (JSX 에서 제거)
 *   - selected-place 에 selected-place-dot div 추가
 *   - tag-list / time-list 빈 상태일 때 조건부 렌더링 처리
 *
 * [백엔드 연결 필요]
 *   - DUMMY_PLACES → 실제 장소 검색 API 로 교체
 *   - fetchStudyById 응답 필드명 확인 (title, field, description, maxMembers, tags, meetingTimes, place, cost, status)
 *   - buildPayload 의 meetingTime / endTime 현재 하드코딩 → 실제 값으로 교체 필요 (포맷 협의)
 *   - tags(해시태그) / cost(참가비) payload 포함 여부 확인
 *   - categoryId 고정값(1~8) 여부 또는 API 목록 조회 여부 확인
 *   - 상태 변경: 별도 API 엔드포인트 여부 확인 (recruiting / completed / paused)
 *   - 임시저장 API 필요 여부 확인
 * ─────────────────────────────────────────────
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PostWrite.css";
import Dropbox from "../components/Dropbox";
import ConfirmPopup from "../components/ConfirmPopup";
import { fetchStudyById, createStudy, updateStudy, deleteStudy } from "../api/study";

const DAY_OPTIONS = [
    { value: "mon", label: "월요일" },
    { value: "tue", label: "화요일" },
    { value: "wed", label: "수요일" },
    { value: "thu", label: "목요일" },
    { value: "fri", label: "금요일" },
    { value: "sat", label: "토요일" },
    { value: "sun", label: "일요일" },
];

const TIME_OPTIONS = [

    { value: "1", label: "새벽 00:00 - 06:00" },
    { value: "2", label: "아침 06:00 - 12:00" },
    { value: "3", label: "점심 12:00 - 18:00" },
    { value: "4", label: "저녁 18:00 - 24:00" },

];

const CATEGORY_OPTIONS = [
    { value: "1", label: "코딩/프로그래밍" },
    { value: "2", label: "영어/외국어" },
    { value: "3", label: "자격증/취업" },
    { value: "4", label: "토익/토플" },
    { value: "5", label: "수학/과학" },
    { value: "6", label: "독서/글쓰기" },
    { value: "7", label: "디자인" },
    { value: "8", label: "기타" },
];


function PostWrite({ isEditMode = false }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [number, setNumber] = useState("");
    const [day, setDay] = useState("");
    const [time, setTime] = useState("");
    const [meetingTimes, setMeetingTimes] = useState([]);
    const [hashtags, setHashtags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [isTagFocused, setIsTagFocused] = useState(false);
    const [placeInput, setPlaceInput] = useState("");
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [cost, setCost] = useState("");
    const [isCostFocused, setIsCostFocused] = useState(false);
    const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
    const [postStatus, setPostStatus] = useState("");
    const [popup, setPopup] = useState({ open: false, message: "", onConfirm: null });
    const [loading, setLoading] = useState(false);
    const [errors,           setErrors]           = useState({});



    // TODO [백엔드]: fetchStudyById(id) 응답 필드명 확인 필요
    // 현재 프론트가 기대하는 필드: title, field, description, maxMembers, tags, meetingTimes, place, cost, status
    useEffect(() => {
        if (isEditMode && id) {
            const load = async () => {
                setLoading(true);
                try {
                    const data = await fetchStudyById(id);
                    if (data) {
                        setTitle(data.title ?? "");
                        setSelectedCategory(data.field ?? "");
                        setDescription(data.description ?? "");
                        setNumber(data.maxMembers ? String(data.maxMembers) : "");
                        setHashtags(data.tags ?? []);
                        setMeetingTimes(data.meetingTimes ?? []);
                        setPlaceInput(data.place ?? "");
                        setCost(data.cost ? String(data.cost) : "");
                        setPostStatus(data.status ?? "");
                    }
                } catch (e) {
                    console.error("데이터 불러오기 실패:", e);
                } finally {
                    setLoading(false);
                }
            };
            load();
        }
    }, [isEditMode, id]);

    const openPopup  = (message, onConfirm) => setPopup({ open: true, message, onConfirm });
    const closePopup = () => setPopup({ open: false, message: "", onConfirm: null });


    const searchPlaces = async () => {
        if (!placeInput.trim()) return;

        try {
            const response = await axios.get(
                `http://localhost:8080/places/search?query=${encodeURIComponent(placeInput)}`
            );

            // console.log("장소 검색 결과:", response.data);
            setSearchResults(response.data.data ?? []);
        } catch (error) {
            console.error("장소 검색 실패", error);
        }
    };


const handleSelectPlace = async (place) => {
    //console.log("선택한 place:", place);

    const payload = {
        name: place.name,
        address: place.roadAddress || place.address,
        latitude: place.latitude,
        longitude: place.longitude,
    };

    //console.log("장소 저장 payload:", payload);

    try {
        const response = await axios.post("http://localhost:8080/places", payload);

        //console.log("장소 저장 응답:", response.data);

        const savedPlace = response.data.data;

        setSelectedPlace({
            id: savedPlace.id ?? savedPlace.placeId,
            placeName: savedPlace.name ?? place.name,
            address: savedPlace.address ?? place.roadAddress ?? place.address,
        });

        setPlaceInput(place.name);
        setSearchResults([]);
        setErrors((prev) => ({ ...prev, place: undefined }));
    } catch (error) {
        console.error("장소 저장 실패", error);
        console.error("에러 응답:", error.response?.data);
    }
};

    // 유효성 검사
    const validate = () => {
        const newErrors = {};
        if (!selectedCategory) newErrors.category = "카테고리를 선택해주세요.";
        if (!title.trim()) newErrors.title = "제목을 입력해주세요.";
        if (!description.trim()) newErrors.description = "모임 설명을 입력해주세요.";
        if (!number) newErrors.number = "최대 인원을 선택해주세요.";
        if (meetingTimes.length === 0) {
            newErrors.meetingTimes = "모임 시간을 선택해주세요.";
        }
        if (!selectedPlace) {
            newErrors.place = "모임 장소를 선택해주세요.";
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleTagKeyDown = (e) => {
        if (e.key === "Enter" && tagInput.trim() !== "") {
            e.preventDefault();
            if (!hashtags.includes(tagInput.trim()) && hashtags.length < 3) {
                setHashtags([...hashtags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove) =>
        setHashtags(hashtags.filter((tag) => tag !== tagToRemove));

    const handleAddMeetingTime = () => {
        if (!day || !time) return;

        const dayLabel = DAY_OPTIONS.find((o) => o.value === day)?.label;
        const timeLabel = TIME_OPTIONS.find((o) => o.value === time)?.label;

        const meetingTimeText = `${dayLabel} ${timeLabel}`;

        setMeetingTimes([
            {
                day,
                time,
                label: meetingTimeText,
            },
        ]);

        setErrors((prev) => ({ ...prev, meetingTimes: undefined }));
    };

    const removeMeetingTime = (t) =>
        setMeetingTimes(meetingTimes.filter((x) => x !== t));


    /*
=======
    const filteredPlaces = DUMMY_PLACES.filter((p) => p.placeName.includes(placeInput));

    // TODO [백엔드]: 아래 payload 필드 구조 및 타입 최종 확인 필요
    // - meetingTime / endTime: 현재 하드코딩됨. 모임 시간 드롭다운(요일+시간대) 값을
    //   실제 datetime 포맷으로 변환하는 로직이 필요합니다. 백엔드에서 기대하는 포맷 알려주세요.
    // - categoryId: number 타입 (1~8), CATEGORY_OPTIONS의 value 기준
    // - placeId: 장소 선택 시 number, 미선택 시 null
    // - tags(hashtags) / meetingTimes: 현재 payload에서 빠져 있음. 포함 여부 확인 필요
    // - cost(참가비): 현재 payload에서 빠져 있음. 포함 여부 확인 필요

    const buildPayload = () => ({
        postTitle:   title,
        postContent: description,
        meetingTime: "2026-05-30T14:00:00", // TODO: 하드코딩 → 실제 값으로 교체
        endTime:     "2026-05-30T16:00:00", // TODO: 하드코딩 → 실제 값으로 교체
        maxMembers:  Number(number),
        categoryId:  Number(selectedCategory),
        placeId:     selectedPlace?.id ?? null,
    });

    */

    const buildPayload = () => ({
        postTitle: title,
        postContent: description,
        // meetingTime: "2026-05-30T14:00:00",
        // endTime: "2026-05-30T16:00:00",
        maxMembers: Number(number),
        categoryId: Number(selectedCategory),
        placeId: selectedPlace?.id ?? null,
        dayOfWeek: meetingTimes[0]?.day,
        timeSlotId: Number(meetingTimes[0]?.time),
    });

    /*


    // TODO [백엔드]: createStudy / updateStudy API 엔드포인트 및 응답 형식 확인 필요
    // 성공 시 /whole-list로 이동, 실패 시 현재 console.error만 처리 중 (에러 UI 추가 여부 논의)

    const handleSubmit = async () => {
        if (!validate()) {
            closePopup();
            return;
        }

        setLoading(true);

        try {

            if (isEditMode && id) {
                await updateStudy(id, buildPayload());
            } else {
                await createStudy(buildPayload());
            }

            navigate("/whole-list");
        } catch (e) {
            console.error("저장 실패:", e);
        } finally {
        
        setLoading(false);
            closePopup();
        }
    };
    */

    const handleSubmit = async () => {
        if (!validate()) {
            closePopup();
            return;
        }

        //console.log("handleSubmit 실행됨");
        //console.log("payload:", buildPayload());

        setLoading(true);

        try {
            await createStudy(buildPayload());

            navigate("/whole-list");
        } catch (e) {
            console.error("저장 실패:", e);
        } finally {
            setLoading(false);
            closePopup();
        }
    };

    // TODO [백엔드]: deleteStudy(id) 성공/실패 응답 형식 확인 필요
    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteStudy(id);
            navigate("/whole-list");
        } catch (e) {
            console.error("삭제 실패:", e);
        } finally {
            setLoading(false);
            closePopup();
        }
    };

    /*
    const handleSubmitClick = () => {
        if (!validate()) return;
        openPopup(isEditMode ? "수정하시겠습니까?" : "게시글을 올리시겠습니까?", handleSubmit);
    };
    */

    const handleSubmitClick = () => {
        //console.log("올리기 클릭됨");

        if (!validate()) {
            //console.log("필수값 누락", errors);
            return;
        }

        openPopup(
            isEditMode ? "수정하시겠습니까?" : "게시글을 올리시겠습니까?",
            handleSubmit
        );
    };

    if (loading && isEditMode && !title) {
        return <div className="post-write-loading">불러오는 중...</div>;
    }

    return (
        <>
            <div
                className="post-write-page"
                onClick={() => { if (isStatusPopupOpen) setIsStatusPopupOpen(false); }}
            >
                <div className="post-write-container">

                    {/* ── 페이지 헤더 ── */}
                    <div className="post-write-header">
                        <div className="post-write-header-label">Study Platform</div>
                        <h1>게시글 <span>{isEditMode ? "수정하기" : "작성하기"}</span></h1>
                        <p className="post-write-subtitle">함께 성장할 팀원을 찾아보세요</p>
                    </div>

                    {/* ── 1. 카테고리 ── */}
                    {/* TODO [백엔드]: categoryId 1~8 고정값인지, API로 목록 받아오는지 확인 필요 */}
                    <div className="form-section">
                        <div className="form-section-header">
                            <div className="form-section-icon">📚</div>
                            <h4>* 1. 카테고리</h4>
                        </div>
                        <p>필수 입력 사항입니다</p>
                        <div className="category-buttons">
                            {CATEGORY_OPTIONS.map((cat) => (
                                <button
                                    key={cat.value}
                                    className={`category-button ${selectedCategory === cat.value ? "selected" : ""}`}
                                    onClick={() => {
                                        setSelectedCategory(cat.value);
                                        setErrors((prev) => ({ ...prev, category: undefined }));
                                    }}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                        {errors.category && <p className="field-error">{errors.category}</p>}
                    </div>

                    {/* ── 2. 제목 ── */}
                    <div className="form-section">
                        <div className="form-section-header">
                            <div className="form-section-icon">✏️</div>
                            <h4>* 2. 제목</h4>
                        </div>
                        <p>필수 입력 사항입니다</p>
                        <div className="input-count-wrapper">
                            <input
                                className={`input ${errors.title ? "input-error" : ""}`}
                                type="text"
                                placeholder="글 제목을 입력해 주세요"
                                maxLength={50}
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    setErrors((prev) => ({ ...prev, title: undefined }));
                                }}
                            />
                            <span className="char-count">{title.length}/50</span>
                        </div>
                        {errors.title && <p className="field-error">{errors.title}</p>}
                    </div>

                    {/* ── 3. 모임 설명 ── */}
                    <div className="form-section">
                        <div className="form-section-header">
                            <div className="form-section-icon">📝</div>
                            <h4>* 3. 모임 설명</h4>
                        </div>
                        <p>필수 입력 사항입니다</p>
                        <div className="input-count-wrapper">
                            <textarea
                                className={`input ${errors.description ? "input-error" : ""}`}
                                placeholder="모임에 대해 설명해주세요"
                                maxLength={500}
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    setErrors((prev) => ({ ...prev, description: undefined }));
                                }}
                            />
                            <span className="char-count">{description.length}/500</span>
                        </div>
                        {errors.description && <p className="field-error">{errors.description}</p>}
                    </div>

                    {/* ── 4. 모임 최대 인원 ── */}
                    {/* TODO [백엔드]: maxMembers 허용 범위 확인 (현재 2~10명으로 제한 중) */}
                    <div className="form-section">
                        <div className="form-section-header">
                            <div className="form-section-icon">👥</div>
                            <h4>* 4. 모임 최대 인원</h4>
                        </div>
                        <p>필수 입력 사항입니다</p>
                        <div className="dropdown-row">
                            <Dropbox
                                placeholder="인원 선택"
                                value={number}
                                onChange={(v) => {
                                    setNumber(v);
                                    setErrors((prev) => ({ ...prev, number: undefined }));
                                }}
                                options={Array.from({ length: 9 }, (_, i) => ({
                                    value: String(i + 2),
                                    label: `${i + 2}명`,
                                }))}
                            />
                        </div>
                        {errors.number && <p className="field-error">{errors.number}</p>}
                    </div>

                    {/* ── 5. 해시태그 ── */}
                    {/* TODO [백엔드]: tags 필드를 payload에 포함할지 확인 필요. 포함 시 string[] 형태로 전송 예정 */}
                    <div className="form-section">
                        <div className="form-section-header">
                            <div className="form-section-icon">#</div>
                            <h4>5. 해시태그</h4>
                        </div>
                        <p>관련 키워드를 추가해 검색 노출을 높이세요 (최대 3개)</p>
                        <div className="hashtag-container">
                            <div className="tag-input-wrapper">
                                {isTagFocused && <span className="tag-prefix">#</span>}
                                <input
                                    className="tag-input"
                                    type="text"
                                    placeholder="해시태그를 입력하세요 (최대 3개)"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    onFocus={() => setIsTagFocused(true)}
                                    onBlur={() => { if (tagInput === "") setIsTagFocused(false); }}
                                />
                            </div>
                            {hashtags.length > 0 && (
                                <div className="tag-list">
                                    {hashtags.map((tag) => (
                                        <div className="tag-item" key={tag}>
                                            {tag}
                                            <button className="tag-delete" onClick={() => removeTag(tag)}>×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── 6. 모임 시간 ── */}
                    {/* TODO [백엔드]: meetingTime / endTime 포맷 확인 필요
                        현재 요일(mon~sun) + 시간대(dawn/morning/afternoon/night) 선택 방식.
                        실제 datetime(ISO 8601)으로 변환 필요한지, 아니면 별도 포맷으로 보낼지 논의 필요 */}
                    <div className="form-section">
                        <div className="form-section-header">
                            <div className="form-section-icon">🕐</div>
                            <h4>* 6. 모임 시간</h4>
                        </div>
                        <p>필수 입력 사항입니다. 요일과 시간대를 선택해 추가하세요 (최대 1개)</p>
                        <div className="dropdown-row">
                            <Dropbox placeholder="요일 선택"   value={day}  onChange={setDay}  options={DAY_OPTIONS}  />
                            <Dropbox placeholder="시간대 선택" value={time} onChange={setTime} options={TIME_OPTIONS} />
                            <button className="time-add-button" onClick={handleAddMeetingTime}>추가</button>
                        </div>

                        <div className="time-list">
                            {meetingTimes.map((meetingTime) => (
                                <div className="time-item" key={`${meetingTime.day}-${meetingTime.time}`}>
                                    {meetingTime.label}
                                    <button
                                        className="time-delete"
                                        onClick={() => setMeetingTimes([])}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        {errors.meetingTimes && (
                            <p className="field-error">{errors.meetingTimes}</p>

                        )}
                        </div>
                        
                        

                    {/* ── 7. 모임 장소 ── */}
                    {/* TODO [백엔드]: 장소 검색 API 연결 필요. 현재 DUMMY_PLACES 사용 중.
                        placeId(number)를 payload로 전송하므로 장소 등록 API의 응답에 id 필드 포함 필요 */}
                    <div className="form-section">
                        <div className="form-section-header">
                            <div className="form-section-icon">📍</div>
                            <h4>7. 모임 장소</h4>
                        </div>
                        <p>오프라인 모임 장소를 설정하세요</p>
                        <div className="place-search-container">
                            <div style={{ display: "flex", gap: "8px" }}>
                                <input
                                    className={`input ${errors.place ? "input-error" : ""}`}
                                    type="text"
                                    placeholder="모임 장소를 입력해 주세요"
                                    value={placeInput}
                                    onChange={(e) => {
                                        setPlaceInput(e.target.value);
                                        setSelectedPlace(null);
                                        setSearchResults([]);
                                    }}
                                />
                                <button
                                    type="button"
                                    className="time-add-button"
                                    onClick={searchPlaces}
                                >
                                    검색
                                </button>
                            </div>

                            {searchResults.length > 0 && !selectedPlace && (
                                <div className="place-result-list">
                                    {searchResults.map((place) => (
                                        <div
                                            className="place-result-item"
                                            key={place.kakaoPlaceId ?? place.id}
                                            onClick={() => handleSelectPlace(place)}
                                                style={{
                                                color: "black"
                                            }}>                                     
                                        <strong>{place.name}</strong>
                                        <p>{place.roadAddress || place.address}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {placeInput && searchResults.length === 0 && !selectedPlace && (
                                <div className="place-no-result">
                                    장소를 검색한 뒤 선택해주세요
                                </div>
                            )}

                            {selectedPlace && (
                                <div className="selected-place">
                                    <div className="selected-place-dot" />
                                    <div>
                                        <strong>{selectedPlace.placeName}</strong>
                                        <p>{selectedPlace.address}</p>
                                    </div>
                                </div>
                            )}

                            {errors.place && <p className="field-error">{errors.place}</p>}
                        </div>
                    </div>

                    {/* ── 8. 장소 예약 비용 ── */}
                    {/* TODO [백엔드]: cost 필드를 payload에 포함할지 확인 필요. 포함 시 number 타입으로 전송 예정 */}
                    <div className="form-section">
                        <div className="form-section-header">
                            <div className="form-section-icon">💰</div>
                            <h4>8. 장소 예약 비용</h4>
                        </div>
                        <p>별도 참가비가 있다면 입력해주세요</p>
                        <div className="cost-input-wrapper">
                            {isCostFocused && <span className="cost-prefix">₩</span>}
                            <input
                                className="cost-input"
                                type="text"
                                placeholder="장소 예약 비용을 입력해 주세요"
                                maxLength={10}
                                value={cost}
                                onChange={(e) => setCost(e.target.value.replace(/[^0-9]/g, ""))}
                                onFocus={() => setIsCostFocused(true)}
                                onBlur={() => { if (cost === "") setIsCostFocused(false); }}
                            />
                        </div>
                    </div>

                    {/* ── 하단 버튼 ── */}
                    <div className="post-action-wrapper">
                        {isEditMode ? (
                            <>
                                <div className="post-button-group">
                                    <button
                                        className="post-button delete"
                                        onClick={() => openPopup("정말 삭제하시겠습니까?", handleDelete)}
                                    >
                                        삭제하기
                                    </button>
                                    <button
                                        className="post-button status"
                                        onClick={(e) => { e.stopPropagation(); setIsStatusPopupOpen(true); }}
                                    >
                                        상태 변경하기
                                    </button>
                                    <button className="post-button submit" onClick={handleSubmitClick}>
                                        수정하기
                                    </button>
                                </div>

                                {/* TODO [백엔드]: 상태 변경 전용 API 엔드포인트가 따로 있는지,
                                    아니면 updateStudy에 status 필드를 포함해서 보내는지 확인 필요
                                    가능한 status 값: "recruiting" | "completed" | "paused" */}
                                {isStatusPopupOpen && (
                                    <div className="status-popup-box" onClick={(e) => e.stopPropagation()}>
                                        <Dropbox
                                            placeholder="상태 선택"
                                            value={postStatus}
                                            onChange={setPostStatus}
                                            options={[
                                                { value: "recruiting", label: "모집 중" },
                                                { value: "completed",  label: "모집 완료" },
                                                { value: "paused",     label: "모집 일시 중단" },
                                            ]}
                                        />
                                        <button
                                            className="post-button submit"
                                            onClick={() => {
                                                setIsStatusPopupOpen(false);
                                                openPopup("상태를 변경하시겠습니까?", async () => {
                                                    //console.log("상태 변경:", postStatus);
                                                    closePopup();
                                                });
                                            }}
                                        >
                                            상태 변경하기
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="post-button-group">
                                {/* TODO [백엔드]: 임시저장 API 필요 여부 확인. 현재 console.log만 처리 중 */}
                                <button
                                    className="post-button save"
                                    onClick={() => openPopup("임시 저장하시겠습니까?", async () => {
                                        //console.log("임시 저장");
                                        closePopup();
                                    })}
                                >
                                    임시 저장
                                </button>
                                <button className="post-button submit" onClick={handleSubmitClick}>
                                    올리기
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {popup.open && (
                <ConfirmPopup
                    message={popup.message}
                    onConfirm={popup.onConfirm}
                    onClose={closePopup}
                />
            )}
        </>
    );
}

export default PostWrite;