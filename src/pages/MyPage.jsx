import React from 'react';
import './MyPage.css';

function MyPage() {
  return (
    <div className="mypage">
      {/* 왼쪽 */}
      <div className="left-section">
        {/* 프로필 카드 */}
        <div className="card profile-card">
          <h2 className="nickname">Nickname</h2>

          <div className="profile-image"></div>

          <div className="info-box">
            <div className="info-row">
              <span className="label">AGE</span>
              <span className="value">비공개</span>
            </div>

            <div className="info-row">
              <span className="label">GENDER</span>
              <span className="value">F</span>
            </div>

            <div className="info-row">
              <span className="label">REGION</span>
              <span className="value">Oxford, UK</span>
            </div>
          </div>
        </div>

        {/* bio */}
        <div className="card bio-card">
          <div className="quote">“</div>
          <p>bio</p>
          <div className="quote right">”</div>
        </div>

        {/* category */}
        <div className="card category-card">
          <h3>Category</h3>

          <div className="tag-wrapper">
            <div className="tag">분야1</div>
            <div className="tag">분야2</div>
            <div className="tag">분야3</div>
            <div className="tag">분야4</div>
            <div className="tag">분야5</div>
          </div>
        </div>

        <button className="edit-btn">내 정보 수정</button>
      </div>

      {/* 오른쪽 */}
      <div className="right-section">
        {/* 상단 */}
        <div className="top-row">
          {/* Schedule */}
          <div className="card schedule-card">
            <div className="card-header">
              <h3>Schedule</h3>
              <button className="small-btn">수정</button>
            </div>

            <div className="schedule-grid">
              <div>월</div>
              <div>화</div>
              <div>수</div>
              <div>목</div>
              <div>금</div>
              <div>토</div>
              <div>일</div>

              <div className="active">새벽</div>
              <div>새벽</div>
              <div>새벽</div>
              <div>새벽</div>
              <div>새벽</div>
              <div>새벽</div>
              <div>새벽</div>

              <div>오전</div>
              <div className="active">오전</div>
              <div>오전</div>
              <div>오전</div>
              <div>오전</div>
              <div>오전</div>
              <div>오전</div>

              <div>오후</div>
              <div>오후</div>
              <div>오후</div>
              <div className="active">오후</div>
              <div>오후</div>
              <div className="active">오후</div>
              <div>오후</div>

              <div>저녁</div>
              <div>저녁</div>
              <div>저녁</div>
              <div>저녁</div>
              <div>저녁</div>
              <div>저녁</div>
              <div className="active">저녁</div>
            </div>
          </div>

          {/* Bookmark */}
          <div className="card bookmark-card">
            <h3>Bookmark</h3>

            <ul>
              <li>게시물1</li>
              <li>게시물2</li>
              <li>게시물3</li>
            </ul>
          </div>
        </div>

        {/* 모임 관리 */}
        <div className="card meeting-card">
          <div className="card-header">
            <h3>모임 관리</h3>

            <div className="meeting-tabs">
              <span className="active-tab">참여 중인 모임</span>
              <span>참여 승인 대기</span>
              <span>신청한 모임</span>
              <span>작성한 모임</span>
            </div>
          </div>

          <ul>
            <li>게시물1</li>
            <li>게시물2</li>
            <li>게시물3</li>
          </ul>
        </div>

        {/* 하단 */}
        <div className="bottom-row">
          {/* Study Log */}
          <div className="card study-card">
            <div className="card-header">
              <div>
                <h3>Study Log</h3>
                <p className="sub-text">
                  일주일동안 이렇게 공부했어요!
                </p>
              </div>

              <button className="small-btn">수정</button>
            </div>

            <div className="time-text">
              13H
              <br />
              06M
            </div>
          </div>

          {/* 사용자 관리 */}
          <div className="card user-card">
            <h3>사용자 관리</h3>

            <div className="user-item">
              <div className="user-profile">
                <div className="mini-profile"></div>

                <div>
                  <p>닉네임</p>
                  <span>#특징</span>
                </div>
              </div>

              <button className="small-btn">
                차단 해제
              </button>
            </div>

            <div className="user-item">
              <div className="user-profile">
                <div className="mini-profile"></div>

                <div>
                  <p>닉네임</p>
                  <span>#특징</span>
                </div>
              </div>

              <button className="small-btn">
                차단 해제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;