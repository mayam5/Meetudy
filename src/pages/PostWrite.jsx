import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    { value: "notDecided", label: "선택하지 않음" },
    { value: "dawn", label: "새벽 00:00 - 06:00" },
    { value: "morning", label: "아침 06:00 - 12:00" },
    { value: "afternoon", label: "점심 12:00 - 18:00" },
    { value: "night", label: "저녁 18:00 - 24:00" },
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

const DUMMY_PLACES = [
    { id: 1, placeName: "투썸플레이스 강남역점", address: "서울 강남구 강남대로 438" },
    { id: 2, placeName: "투썸플레이스 강남대로점", address: "서울 강남구 강남대로 422" },
    { id: 3, placeName: "스타벅스 강남역점", address: "서울 강남구 테헤란로 101" },
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
    const [cost, setCost] = useState("");
    const [isCostFocused, setIsCostFocused] = useState(false);
    const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
    const [postStatus, setPostStatus] = useState("");
    const [popup, setPopup] = useState({ open: false, message: "", onConfirm: null });
    const [loading, setLoading] = useState(false);

    // 유효성 검사 에러
    const [errors, setErrors] = useState({});

    // 수정 모드 - 기존 데이터 불러오기
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

    const openPopup = (message, onConfirm) => setPopup({ open: true, message, onConfirm });
    const closePopup = () => setPopup({ open: false, message: "", onConfirm: null });

    // 유효성 검사
    const validate = () => {
        const newErrors = {};
        if (!selectedCategory) newErrors.category = "카테고리를 선택해주세요.";
        if (!title.trim()) newErrors.title = "제목을 입력해주세요.";
        if (!description.trim()) newErrors.description = "모임 설명을 입력해주세요.";
        if (!number) newErrors.number = "최대 인원을 선택해주세요.";
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

    const removeTag = (tagToRemove) => {
        setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
    };

    const handleAddMeetingTime = () => {
        if (day === "" || meetingTimes.length >= 3) return;
        const dayLabel = DAY_OPTIONS.find((o) => o.value === day)?.label;
        const timeLabel = TIME_OPTIONS.find((o) => o.value === time)?.label;
        const meetingTimeText = !time || time === "notDecided"
            ? dayLabel
            : `${dayLabel} ${timeLabel}`;
        if (!meetingTimes.includes(meetingTimeText)) {
            setMeetingTimes([...meetingTimes, meetingTimeText]);
        }
        setDay("");
        setTime("");
    };

    const removeMeetingTime = (timeToRemove) => {
        setMeetingTimes(meetingTimes.filter((t) => t !== timeToRemove));
    };

    const filteredPlaces = DUMMY_PLACES.filter((place) =>
        place.placeName.includes(placeInput)
    );

    /*
    const buildPayload = () => ({
        title,
        field: selectedCategory,
        description,
        maxMembers: Number(number),
        tags: hashtags,
        meetingTimes,
        place: selectedPlace?.placeName ?? placeInput,
        cost: Number(cost) || 0,
        status: postStatus || "recruiting",
    });
    */

const buildPayload = () => ({
    postTitle: title,
    postContent: description,
    meetingTime: "2026-05-30T14:00:00",
    endTime: "2026-05-30T16:00:00",
    maxMembers: Number(number),
    categoryId: Number(selectedCategory),
    placeId: selectedPlace?.id ?? null,
});

    const handleSubmit = async () => {
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

    const handleSubmitClick = () => {
        if (!validate()) return;
        openPopup(
            isEditMode ? "수정하시겠습니까?" : "게시글을 올리시겠습니까?",
            handleSubmit
        );
    };

    if (loading && isEditMode && !title) {
        return <div style={{ textAlign: "center", marginTop: "200px" }}>불러오는 중...</div>;
    }

    return (
        <>
            <div
                className="post-write-page"
                onClick={() => { if (isStatusPopupOpen) setIsStatusPopupOpen(false); }}
            >
                <div className="post-write-container">

                    <h1>게시글 {isEditMode ? "수정하기" : "작성하기"}</h1>

                    {/* 1. 카테고리 */}
                    <div className="form-section">
                        <h4>* 1. 카테고리</h4>
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

                    {/* 2. 제목 */}
                    <div className="form-section">
                        <h4>* 2. 제목</h4>
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

                    {/* 3. 모임 설명 */}
                    <div className="form-section">
                        <h4>* 3. 모임 설명</h4>
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

                    {/* 4. 모임 최대 인원 */}
                    <div className="form-section">
                        <h4>* 4. 모임 최대 인원</h4>
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

                    {/* 5. 해시태그 */}
                    <div className="form-section">
                        <h4>5. 해시태그</h4>
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
                            <div className="tag-list">
                                {hashtags.map((tag) => (
                                    <div className="tag-item" key={tag}>
                                        #{tag}
                                        <button className="tag-delete" onClick={() => removeTag(tag)}>×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 6. 모임 시간 */}
                    <div className="form-section">
                        <h4>6. 모임 시간</h4>
                        <div className="dropdown-row">
                            <Dropbox placeholder="요일 선택" value={day} onChange={setDay} options={DAY_OPTIONS} />
                            <Dropbox placeholder="시간대 선택" value={time} onChange={setTime} options={TIME_OPTIONS} />
                            <button className="time-add-button" onClick={handleAddMeetingTime}>추가</button>
                        </div>
                        <div className="time-list">
                            {meetingTimes.map((meetingTime) => (
                                <div className="time-item" key={meetingTime}>
                                    {meetingTime}
                                    <button className="time-delete" onClick={() => removeMeetingTime(meetingTime)}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 7. 모임 장소 */}
                    <div className="form-section">
                        <h4>7. 모임 장소</h4>
                        <div className="place-search-container">
                            <input
                                className="input"
                                type="text"
                                placeholder="모임 장소를 입력해 주세요"
                                value={placeInput}
                                onChange={(e) => { setPlaceInput(e.target.value); setSelectedPlace(null); }}
                            />
                            {placeInput && !selectedPlace && (
                                <div className="place-result-list">
                                    {filteredPlaces.length > 0 ? (
                                        filteredPlaces.map((place) => (
                                            <div
                                                className="place-result-item"
                                                key={place.id}
                                                onClick={() => { setSelectedPlace(place); setPlaceInput(place.placeName); }}
                                            >
                                                <strong>{place.placeName}</strong>
                                                <p>{place.address}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="place-no-result">검색 결과가 없습니다</div>
                                    )}
                                </div>
                            )}
                            {selectedPlace && (
                                <div className="selected-place">
                                    <strong>{selectedPlace.placeName}</strong>
                                    <p>{selectedPlace.address}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 8. 장소 예약 비용 */}
                    <div className="form-section">
                        <h4>8. 장소 예약 비용</h4>
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

                    {/* 하단 버튼 */}
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
                                    <button
                                        className="post-button submit"
                                        onClick={handleSubmitClick}
                                    >
                                        수정하기
                                    </button>
                                </div>

                                {isStatusPopupOpen && (
                                    <div
                                        className="status-popup-box"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Dropbox
                                            placeholder="상태 선택"
                                            value={postStatus}
                                            onChange={setPostStatus}
                                            options={[
                                                { value: "recruiting", label: "모집 중" },
                                                { value: "completed", label: "모집 완료" },
                                                { value: "paused", label: "모집 일시 중단" },
                                            ]}
                                        />
                                        <button
                                            className="post-button submit"
                                            onClick={() => {
                                                setIsStatusPopupOpen(false);
                                                openPopup("상태를 변경하시겠습니까?", async () => {
                                                    console.log("상태 변경:", postStatus);
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
                                <button
                                    className="post-button save"
                                    onClick={() => openPopup("임시 저장하시겠습니까?", async () => {
                                        console.log("임시 저장");
                                        closePopup();
                                    })}
                                >
                                    임시 저장
                                </button>
                                <button
                                    className="post-button submit"
                                    onClick={handleSubmitClick}
                                >
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