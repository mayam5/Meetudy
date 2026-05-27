 {/* 
    PostWrite.jsx / PostWrite.css

    <게시글 작성하기>

    ! 입력란 글자수 제한, 최대 글자수 확인
    * 1. 카테고리 - 등록된 카테고리 중 한 개만 선택 가능
                 - 선택한 카테고리: <button className="category-button selected">
                 - 이외 카테고리: <button className="category-button>
    * 2. 제목 - 텍스트 입력, 글자수 50자 제한
    * 3. 모임 설명 - 텍스트 입력, 글자수 500자 제한
    * 4. 모임 최대 인원
    (*표시 - 필수 입력 항목)
    5. 해시태그 - 텍스트 입력 -> 버튼 생성, 중복 불가, 최대 3개 가능, 삭제 가능
    6. 모임 시간 - (요일 + 시간대) 선택 가능, 중복 불가, 최대 3개 가능, 삭제 가능
    7. 모임 장소 - 텍스트 입력 -> 자동검색, map api 연동, 한 개만 선택 가능
    8. 장소 예약 비용 - 텍스트 입력, 숫자만 입력 가능, 글자수 10자 제한

    <하단 버튼>
    처음 작성 - 임시저장, 올리기
    이후 - 삭제하기, 상태 변경하기, 수정하기
                   - 상태 변경하기 - 모집 중, 모집 완료, 모집 일시 중단
  */}



import { useState } from "react";
import Header from "../components/Header";
import "./PostWrite.css";
import Dropbox from "../components/Dropbox";
import ConfirmPopup from "../components/ConfirmPopup";

function PostWrite() {
  // const [memberCount, setMemberCount] = useState("");

  {/* 처음 작성인지, 수정 중인지 구분 - true: 수정 중, false: 처음 작성*/}
  const [isEditMode, setIsEditMode] = useState(true);

  {/* 상태 변경하기 기능을 위함 - 백엔드 연동 필요 없음 */}
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [postStatus, setPostStatus] = useState("");

  {/* 모임 인원 */}
  const [number, setNumber] = useState("");

  {/* 모임 시간 */}
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [meetingTimes, setMeetingTimes] = useState([]);

  {/* 해시태그 */}
  const [hashtags, setHashtags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isTagFocused, setIsTagFocused] = useState(false);

  {/* 모임 장소 */}
  const [placeInput, setPlaceInput] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);

  {/* 장소 예약 비용 */}
  const [cost, setCost] = useState("");
  const [isCostFocused, setIsCostFocused] = useState(false);

  {/* 해시태그 */}
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();

    // 중복 방지
    if (!hashtags.includes(tagInput.trim()) && hashtags.length < 3) {
      setHashtags([...hashtags, tagInput.trim()]);
    }

    setTagInput("");
    }
  };

  // 해시태그 삭제
  const removeTag = (tagToRemove) => {
    setHashtags(
      hashtags.filter((tag) => tag !== tagToRemove)
    );
  };

  {/* 모임 시간 */}
  const handleAddMeetingTime = () => {
    if (day === "") {
      return;
    }

    if (meetingTimes.length >= 3) {
      return;
    }

    const dayLabel = dayOptions.find((option) => option.value === day)?.label;
    const timeLabel = timeOptions.find((option) => option.value === time)?.label;

    const meetingTimeText =
      time === "" || time === "notDecided"
        ? dayLabel
        : `${dayLabel} ${timeLabel}`;

    if (!meetingTimes.includes(meetingTimeText)) {
      setMeetingTimes([...meetingTimes, meetingTimeText]);
    }

    setDay("");
    setTime("");
  };

  // 모임 시간 버튼 삭제
  const removeMeetingTime = (timeToRemove) => {
    setMeetingTimes(
      meetingTimes.filter((meetingTime) => meetingTime !== timeToRemove)
    );
  };

const dayOptions = [
  { value: "mon", label: "월요일" },
  { value: "tue", label: "화요일" },
  { value: "wed", label: "수요일" },
  { value: "thu", label: "목요일" },
  { value: "fri", label: "금요일" },
  { value: "sat", label: "토요일" },
  { value: "sun", label: "일요일" },
];

const timeOptions = [
  { value: "notDecided", label: "선택하지 않음" },
  { value: "dawn", label: "새벽 00:00 - 06:00" },
  { value: "morning", label: "아침 06:00 - 12:00" },
  { value: "afternoon", label: "점심 12:00 - 18:00" },
  { value: "night", label: "저녁 18:00 - 24:00" },
];

   {/* 모임 장소 검색 테스트 - map api 연동 필요 */}
  const dummyPlaces = [
    {
      id: 1,
      placeName: "투썸플레이스 강남역점",
      address: "서울 강남구 강남대로 438",
    },
    {
      id: 2,
      placeName: "투썸플레이스 강남대로점",
      address: "서울 강남구 강남대로 422",
    },
    {
      id: 3,
      placeName: "스타벅스 강남역점",
      address: "서울 강남구 테헤란로 101",
    },
];

const filteredPlaces = dummyPlaces.filter((place) =>
  place.placeName.includes(placeInput)
);

const [popupMessage, setPopupMessage] = useState("");






  return (
    <>
    <div
      className="post-write-page"
      onClick={() => {
        if (isStatusPopupOpen) {
          setIsStatusPopupOpen(false);
        }
      }}
    >
  
      {/* 게시글 작성 팝업 */}
      <div className="post-write-container">
        


        {/* 게시글 작성하기 (글씨) */}
        <h1>게시글 작성하기</h1>


        {/* 1. 카테고리 */}
        <div className="form-section">
          <h4>* 1. 카테고리</h4>
          <p>필수 입력 사항입니다</p>

            <div className="category-buttons">
                <button className="category-button selected">취업</button>
                <button className="category-button">어학</button>
                <button className="category-button">고시/공무원</button>
                <button className="category-button">자격증</button>
            </div>
        </div>


        {/* 2. 글 제목 */}
        <div className="form-section">
            <h4>* 2. 제목</h4>
            <p>필수 입력 사항입니다</p>

          <input
            className="input"
            type="text"
            placeholder="글 제목을 입력해 주세요"
            maxLength={50}
          />
        </div>


        {/* 3. 모임 설명 */}
        <div className="form-section">
          <h4>* 3. 모임 설명</h4>
          <p>필수 입력 사항입니다</p>
          
          <textarea
            className="input"
            placeholder="모임에 대해 설명해주세요"
            maxLength={500}
          ></textarea>
        </div>


        {/* 4. 모임 최대 인원 */}
        <div className="form-section">
            <h4>* 4. 모임 최대 인원</h4>
            <p>필수 입력 사항입니다</p>

            <div className="dropdown-row">
              <Dropbox
                placeholder="인원 선택"
                value={number}
                onChange={setNumber}
                options={[
                  { value: "2", label: "2명" },
                  { value: "3", label: "3명" },
                  { value: "4", label: "4명" },
                  { value: "5", label: "5명" },
                  { value: "6", label: "6명" },
                  { value: "7", label: "7명" },
                  { value: "8", label: "8명" },
                  { value: "9", label: "9명" },
                  { value: "10", label: "10명" },
                ]}
              />
            </div>

        </div>


        {/* 5. 해시태그 */}
        <div className="form-section">
          <h4>5. 해시태그</h4>

          <div className="hashtag-container">

            <div className="tag-input-wrapper">

              {isTagFocused && (
                <span className="tag-prefix">#</span>
              )}

              <input
                className="tag-input"
                type="text"
                placeholder="해시태그를 입력하세요. (e.g. #개발)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}

                onFocus={() => setIsTagFocused(true)}
                onBlur={() => {
                  if (tagInput === "") {
                    setIsTagFocused(false);
                  }
                }}
              />

            </div>

            <div className="tag-list">
              {hashtags.map((tag, index) => (
                <div className="tag-item" key={index}>
                  #{tag}

                  <button
                    className="tag-delete"
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>


        {/* 6. 모임 시간 */}
        <div className="form-section">
          <h4>6. 모임 시간</h4>

          <div className="dropdown-row">
            <Dropbox
              placeholder="요일 선택"
              value={day}
              onChange={setDay}
              options={dayOptions}
            />

            <Dropbox
              placeholder="시간대 선택"
              value={time}
              onChange={setTime}
              options={timeOptions}
            />

            <button
              className="time-add-button"
              onClick={handleAddMeetingTime}
            >
              추가
            </button>
          </div>

          <div className="time-list">
            {meetingTimes.map((meetingTime, index) => (
              <div className="time-item" key={index}>
                {meetingTime}

                <button
                  className="time-delete"
                  onClick={() => removeMeetingTime(meetingTime)}
                >
                  ×
                </button>
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
              onChange={(e) => {
                setPlaceInput(e.target.value);
                setSelectedPlace(null);
              }}
            />

            {placeInput && !selectedPlace && (
              <div className="place-result-list">
                {filteredPlaces.length > 0 ? (
                  filteredPlaces.map((place) => (
                    <div
                      className="place-result-item"
                      key={place.id}
                      onClick={() => {
                        setSelectedPlace(place);
                        setPlaceInput(place.placeName);
                      }}
                    >
                      <strong>{place.placeName}</strong>
                      <p>{place.address}</p>
                    </div>
                  ))
                ) : (
                  <div className="place-no-result">
                    검색 결과가 없습니다
                  </div>
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

            {isCostFocused && (
              <span className="cost-prefix">₩</span>
            )}

            <input
              className="cost-input"
              type="text"
              placeholder="장소 예약을 진행할 경우, 비용을 입력해 주세요"
              maxLength={10}
              value={cost}
              onChange={(e) => setCost(e.target.value.replace(/[^0-9]/g, ""))}

              onFocus={() => setIsCostFocused(true)}
              onBlur={() => {
                if (cost === "") {
                  setIsCostFocused(false);
                }
              }}
            />

          </div>
        </div>


        {/* 하단 버튼 영역 */}
        <div className="post-action-wrapper">

          {isEditMode ? (

            <>

              <div className="post-button-group">

              <button
                className="post-button delete"
                onClick={() => setPopupMessage("삭제되었습니다")}
              >
                삭제하기
              </button>

                <button
                  className="post-button status"
                  onClick={() => setIsStatusPopupOpen(true)}
                >
                  상태 변경하기
                </button>

                <button className="post-button submit"
                onClick={() => setPopupMessage("수정되었습니다")}
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
                      setPopupMessage("상태가 변경되었습니다");
                    }}
                  >
                    상태 변경하기
                  </button>


                </div>
              )}

            </>

          ) : (

            <div className="post-button-group">

              <button className="post-button save"
              onClick={() => setPopupMessage("저장되었습니다")}
              >
                임시 저장
              </button>

              <button className="post-button submit"
              onClick={() => setPopupMessage("완료했습니다")}
              >
                올리기
              </button>

            </div>

          )}

        </div>
        

      </div>
    </div>

    {popupMessage && (
      <ConfirmPopup
        message={popupMessage}
        onClose={() => setPopupMessage("")}
      />
    )}
    </>
  );

}


export default PostWrite;