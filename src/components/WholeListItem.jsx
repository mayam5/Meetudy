import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AvatarGroup from "./AvatarGroup";
import HostInfo from "./HostInfo";
import { FiBookmark, FiMessageCircle, FiUsers } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import ConfirmPopup from "./ConfirmPopup";
import { toggleBookmark } from "../api/user";
import "./WholeListItem.css";

// ====================================================
// [백엔드 연결] API 경로
// - GET  /api/studies/:id/applications
//     res: [{ applicationId, userId, nickname, field, appliedAt }, ...]
//
// - POST /api/studies/:id/applications/:applicationId/accept
//     res: { success, message }
//
// - POST /api/studies/:id/applications/:applicationId/reject
//     res: { success, message }
// ====================================================
const API_BASE = "/api";

function ApplicationPopup({ studyId, onClose }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  useState(() => {
    // [백엔드 연결] 신청자 목록 조회
    fetch(`${API_BASE}/studies/${studyId}/applications`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    })
      .then((res) => res.json())
      .then((result) => {
        setApplicants(result || []);
        setLoading(false);
      })
      .catch(() => {
        setError("신청자 목록을 불러오지 못했습니다.");
        setLoading(false);
      });
  }, []);

  // [백엔드 연결] 신청 수락
  const handleAccept = async (applicationId) => {
    setProcessingId(applicationId);
    try {
      const res = await fetch(`${API_BASE}/studies/${studyId}/applications/${applicationId}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      const result = await res.json();
      if (!result.success) { alert(result.message || "수락에 실패했습니다."); return; }
      setApplicants((prev) => prev.filter((a) => a.applicationId !== applicationId));
    } catch {
      alert("서버 연결에 실패했습니다.");
    } finally {
      setProcessingId(null);
    }
  };

  // [백엔드 연결] 신청 거절
  const handleReject = async (applicationId) => {
    setProcessingId(applicationId);
    try {
      const res = await fetch(`${API_BASE}/studies/${studyId}/applications/${applicationId}/reject`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      const result = await res.json();
      if (!result.success) { alert(result.message || "거절에 실패했습니다."); return; }
      setApplicants((prev) => prev.filter((a) => a.applicationId !== applicationId));
    } catch {
      alert("서버 연결에 실패했습니다.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="app-popup-overlay" onClick={onClose}>
      <div className="app-popup" onClick={(e) => e.stopPropagation()}>
        <div className="app-popup-header">
          <div className="app-popup-title">신청자 관리</div>
          <button className="app-popup-close" onClick={onClose}>✕</button>
        </div>

        <div className="app-popup-body">
          {loading && <div className="app-popup-status">불러오는 중...</div>}
          {error && <div className="app-popup-status error">{error}</div>}
          {!loading && !error && applicants.length === 0 && (
            <div className="app-popup-status">신청자가 없습니다.</div>
          )}
          {!loading && !error && applicants.map((a) => (
            <div key={a.applicationId} className="applicant-card">
              <div className="applicant-avatar">{a.nickname?.[0] ?? "?"}</div>
              <div className="applicant-info">
                <div className="applicant-name"
                  onClick={() => navigate(`/profile/${a.userId}`)}
                  style={{ cursor: "pointer" }}
                >
                  {a.nickname}
                </div>
                <div className="applicant-field">{a.field}</div>
              </div>
              <div className="applicant-actions">
                <button
                  className="accept-btn"
                  disabled={processingId === a.applicationId}
                  onClick={() => handleAccept(a.applicationId)}
                >
                  수락
                </button>
                <button
                  className="reject-btn"
                  disabled={processingId === a.applicationId}
                  onClick={() => handleReject(a.applicationId)}
                >
                  거절
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WholeListItem({
  id,
  title = "",
  tags = [],
  host = "",
  hostId,
  field = "",
  users = [],
  type = "written",
  profileImage,
  applicationStatus = "pending",
  isBookmarked: initialBookmarked = false,
  onDelete,
  onCancel,
  onLeave,
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [popup, setPopup] = useState({ open: false, message: "", onConfirm: null });
  const [showAppPopup, setShowAppPopup] = useState(false);
  const navigate = useNavigate();

  const handleBookmark = async (e) => {
    e.stopPropagation();
    const prev = isBookmarked;
    setIsBookmarked(!prev);
    try {
      await toggleBookmark(id);
    } catch (err) {
      console.error("북마크 실패:", err);
      setIsBookmarked(prev);
    }
  };

  const openPopup = (message, onConfirm) =>
    setPopup({ open: true, message, onConfirm });
  const closePopup = () =>
    setPopup({ open: false, message: "", onConfirm: null });

  const handleTitleClick = (e) => {
    e.stopPropagation();
    navigate(`/study/${id}`);
  };

  const stopProp = (e) => e.stopPropagation();

  return (
    <>
      <div className="list-item">
        <button type="button" className="list-bookmark" onClick={handleBookmark}>
          {isBookmarked ? <BsBookmarkFill style={{ color: "#2563eb" }} /> : <FiBookmark />}
        </button>

        <div className="list-title-box" onClick={handleTitleClick} style={{ cursor: "pointer" }}>
          <strong className="list-title">{title}</strong>
          <span className="list-tags">
            {Array.isArray(tags) ? tags.map((t) => `#${t}`).join(" ") : ""}
          </span>
        </div>

        <div
          onClick={stopProp}
          style={{ cursor: hostId ? "pointer" : "default" }}
          onClickCapture={(e) => { e.stopPropagation(); if (hostId) navigate(`/profile/${hostId}`); }}
        >
          <HostInfo host={host} field={field} />
        </div>

        <AvatarGroup users={users} />

        <div className="list-actions" onClick={stopProp}>
          {type === "written" && (
            <>
              <button
                className="applicant-manage-btn"
                onClick={() => setShowAppPopup(true)}
              >
                <FiUsers />
                신청 관리
              </button>
              <button onClick={() => navigate(`/post-edit/${id}`)}>수정</button>
              <button
                className="delete-btn"
                onClick={() =>
                  openPopup("정말 삭제하시겠습니까?", () => {
                    onDelete?.();
                    closePopup();
                  })
                }
              >
                삭제
              </button>
            </>
          )}

          {type === "applied" && (
            <>
              {applicationStatus === "pending" && (
                <button
                  className="cancel-btn"
                  onClick={() =>
                    openPopup("신청을 취소하시겠습니까?", () => {
                      onCancel?.();
                      closePopup();
                    })
                  }
                >
                  신청 취소
                </button>
              )}
              {applicationStatus === "accepted" && (
                <span className="accepted-text">수락됨</span>
              )}
              {applicationStatus === "rejected" && (
                <span className="rejected-text">거절됨</span>
              )}
            </>
          )}

          {type === "joined" && (
            <>
              <button className="chat-btn" onClick={() => navigate("/chat")}>
                <FiMessageCircle />
                채팅방
              </button>
              <button
                onClick={() =>
                  openPopup("모임에서 나가시겠습니까?", () => {
                    onLeave?.();
                    closePopup();
                  })
                }
              >
                나가기
              </button>
            </>
          )}
        </div>
      </div>

      {showAppPopup && (
        <ApplicationPopup
          studyId={id}
          onClose={() => setShowAppPopup(false)}
        />
      )}

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

export default WholeListItem;