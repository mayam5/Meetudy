import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AvatarGroup from "./AvatarGroup";
// import HostInfo from "./HostInfo";
import { FiBookmark, FiMessageCircle } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import ConfirmPopup from "./ConfirmPopup";
import "./WholeListItem.css";




function WholeListItem({
  title,
  host,
  hostID,
  users,
  type = "written",
  profileImage,
  applicationStatus = "pending"
}) {

  const [isBookmarked, setIsBookmarked] = useState(false);

  const navigate = useNavigate();

  const handleHostClick = () => {
    navigate(`/profile/${hostId}`);
  };

/*
  const handleHostClick = () => {
    if (!hostId) return;
    navigate(`/profile/${hostId}`);
  };
  */

  const [popupMessage, setPopupMessage] = useState("");




  return (
    <div className="list-item">
      <button
        type="button"
        className="list-bookmark"
        onClick={() => setIsBookmarked(!isBookmarked)}
      >
        {isBookmarked ? <BsBookmarkFill /> : <FiBookmark />}
      </button>

      <div className="list-title-box">
        <strong className="list-title">{title}</strong>
        <span className="list-tags">#IT #분야 #분야</span>
      </div>

      <div className="list-host" onClick={handleHostClick}>
        {profileImage ? (
          <img className="list-host-profile" src={profileImage} alt="profile" />
        ) : (
          <div className="list-host-profile">
            {host?.[0] || "닉"}
          </div>
        )}

        <span className="list-host-name">{host}</span>
      </div>

      <AvatarGroup users={users} />

      <div className="list-actions">
        {type === "written" && (
          <>
            <button onClick={() => navigate("/postwrite")}>
              수정
            </button>
            <button
              onClick={() => setPopupMessage("삭제되었습니다")}
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
              onClick={() => setPopupMessage("신청이 취소되었습니다")}
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
            onClick={() => setPopupMessage("모임에서 나갔습니다")}
          >
            나가기
          </button>
        </>
        )}

        {type === "bookmark" && null}

        {type === "all" && null}

      </div>


      {popupMessage && (
        <ConfirmPopup
          message={popupMessage}
          onClose={() => setPopupMessage("")}
        />
      )}
    </div>
  );
}

export default WholeListItem;