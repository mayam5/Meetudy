import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AvatarGroup from "./AvatarGroup";
import HostInfo from "./HostInfo";
import { FiBookmark, FiMessageCircle, FiUsers } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import ApplicantPopup from "./ApplicantPopup";
import ConfirmPopup from "./ConfirmPopup";
import { toggleBookmark } from "../api/user";
import "./WholeListItem.css";

function WholeListItem({
  id,
  title = "",
  tags = [],
  host = "",
  hostId,
  field = "",
  users = [],
  currentMembers,
  maxMembers,
  type = "all",
  applicationStatus = "pending",
  isBookmarked: initialBookmarked = false,
  onDelete,
  onCancel,
  onLeave,
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const [popup, setPopup] = useState({
    open: false,
    message: "",
    onConfirm: null,
  });
  const [showAppPopup, setShowAppPopup] = useState(false);

  const navigate = useNavigate();

  const handleBookmark = async (e) => {
    e.stopPropagation();

    const prev = isBookmarked;
    setIsBookmarked(!prev);

    try {
      await toggleBookmark(id, prev);
    } catch (err) {
      console.error("북마크 실패:", err);
      setIsBookmarked(prev);
    }
  };

  const openPopup = (message, onConfirm) => {
    setPopup({ open: true, message, onConfirm });
  };

  const closePopup = () => {
    setPopup({ open: false, message: "", onConfirm: null });
  };

  const handleTitleClick = (e) => {
    e.stopPropagation();
    navigate(`/study/${id}`);
  };

  const stopProp = (e) => e.stopPropagation();

  return (
    <>
      <div className="list-item">
        <button type="button" className="list-bookmark" onClick={handleBookmark}>
          {isBookmarked ? (
            <BsBookmarkFill style={{ color: "#2563eb" }} />
          ) : (
            <FiBookmark />
          )}
        </button>

        <div
          className="list-title-box"
          onClick={handleTitleClick}
          style={{ cursor: "pointer" }}
        >
          <strong className="list-title">{title}</strong>
          <span className="list-tags">
            {Array.isArray(tags) ? tags.map((t) => `#${t}`).join(" ") : ""}
          </span>
        </div>

        <div
          onClick={stopProp}
          style={{ cursor: hostId ? "pointer" : "default" }}
          onClickCapture={(e) => {
            e.stopPropagation();
            if (hostId) navigate(`/profile/${hostId}`);
          }}
        >
          <HostInfo host={host} field={field} />
        </div>
        
        <div className="list-actions" onClick={stopProp}>
          <AvatarGroup users={users} />
          {currentMembers !== undefined && maxMembers !== undefined && (
            <span className="member-count">{currentMembers} / {maxMembers}</span>
          )}
          {type === "n" && (
            <>
              <button
                className="applicant-manage-btn"
                onClick={() => setShowAppPopup(true)}
              >
                <FiUsers />
                신청 관리
              </button>

              <button onClick={() => navigate(`/post-edit/${id}`)}>
                수정
              </button>

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
        <ApplicantPopup
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