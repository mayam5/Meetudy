import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AvatarGroup from "./AvatarGroup";
import { FiBookmark, FiMessageCircle } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import ConfirmPopup from "./ConfirmPopup";
import { toggleBookmark } from "../api/user";
import "./WholeListItem.css";

function WholeListItem({

  title,
  host,
  hostId,
  users = [],
  type = "written",
  profileImage,
  applicationStatus = "pending"

/*
    id,
    title = "",
    host = "",
    hostId,
    users = [],
    tags = [],
    type = "written",
    profileImage,
    applicationStatus = "pending",
    onDelete,
    onCancel,
    onLeave,
*/

}) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [popup, setPopup] = useState({ open: false, message: "", onConfirm: null });
    const navigate = useNavigate();

    const handleHostClick = () => {
        if (!hostId) return;
        navigate(`/profile/${hostId}`);
    };

    const handleBookmark = async () => {
        try {
            await toggleBookmark(id);
            setIsBookmarked(!isBookmarked);
        } catch (e) {
            console.error("북마크 실패:", e);
        }
    };

    const openPopup = (message, onConfirm) => setPopup({ open: true, message, onConfirm });
    const closePopup = () => setPopup({ open: false, message: "", onConfirm: null });

    return (
        <div className="list-item">

            <button
                type="button"
                className="list-bookmark"
                onClick={handleBookmark}
            >
                {isBookmarked ? <BsBookmarkFill /> : <FiBookmark />}
            </button>

            <div
                className="list-title-box"
                onClick={() => navigate(`/study/${id}`)}
                style={{ cursor: "pointer" }}
            >
                <strong className="list-title">{title}</strong>
                <span className="list-tags">
                    {tags.length > 0 ? tags.map((t) => `#${t}`).join(" ") : ""}
                </span>
            </div>

            <div className="list-host" onClick={handleHostClick}>
                {profileImage ? (
                    <img className="list-host-profile" src={profileImage} alt="profile" />
                ) : (
                    <div className="list-host-profile">{host?.[0] || "닉"}</div>
                )}
                <span className="list-host-name">{host}</span>
            </div>

            <AvatarGroup users={users} />

            <div className="list-actions">
                {type === "written" && (
                    <>
                        <button onClick={() => navigate(`/post-edit/${id}`)}>수정</button>
                        <button
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

            {popup.open && (
                <ConfirmPopup
                    message={popup.message}
                    onConfirm={popup.onConfirm}
                    onClose={closePopup}
                />
            )}
        </div>
    );
}

export default WholeListItem;