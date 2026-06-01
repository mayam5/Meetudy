// ====================================================
// [백엔드 연결] 알림 API
//
// GET /api/notifications
//   res: [
//     {
//       id: number,
//       type: "apply" | "accepted" | "rejected" | "chat" |
//             "kicked" | "left" | "closed" | "deadline" | "new_study",
//       message: string,
//       time: string,        // 예) "5분 전"
//       read: boolean,
//       link: string,        // 클릭 시 이동할 경로
//     },
//     ...
//   ]
//
// 타입별 link 경로:
//   - apply     → "/whole-list"          (내 모임 신청자 관리)
//   - accepted  → "/study/:studyId"      (수락된 스터디 상세)
//   - rejected  → "/whole-list"          (전체 모임 목록)
//   - chat      → "/chat"                (채팅방)
//   - kicked    → "/whole-list"          (전체 모임 목록)
//   - left      → "/whole-list"          (내가 작성한 모임)
//   - closed    → "/study/:studyId"      (마감된 스터디 상세)
//   - deadline  → "/study/:studyId"      (D-1 스터디 상세)
//   - new_study → "/study/:studyId"      (새로 등록된 스터디)
//
// POST /api/notifications/:id/read
//   res: { success, message }
//
// POST /api/notifications/read-all
//   res: { success, message }
// ====================================================

import "./NotificationList.css";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { markAllNotificationsRead } from "../api/notification";

const TYPE_CONFIG = {
    apply:     { icon: "📩", label: "신청",     color: "blue"   },
    accepted:  { icon: "✅", label: "수락",     color: "green"  },
    rejected:  { icon: "❌", label: "거절",     color: "red"    },
    chat:      { icon: "💬", label: "채팅",     color: "blue"   },
    kicked:    { icon: "🚫", label: "강퇴",     color: "red"    },
    left:      { icon: "🚶", label: "탈퇴",     color: "gray"   },
    closed:    { icon: "🔒", label: "마감",     color: "gray"   },
    deadline:  { icon: "⏰", label: "D-1",      color: "amber"  },
    new_study: { icon: "🆕", label: "새 모임",  color: "green"  },
};

function NotificationList({ onClose, notifications = [], onRead, onReadAll }) {
    const navigate = useNavigate();
    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleReadAll = async () => {
        try {
            await markAllNotificationsRead();
            onReadAll?.();
        } catch (e) {
            console.error("전체 읽음 처리 실패:", e);
        }
    };

    const handleClick = (noti) => {
        onRead?.(noti.id);
        if (noti.link) {
            navigate(noti.link);
            onClose?.();
        }
    };

    return (
        <div className="noti-dropdown">

            {/* 헤더 */}
            <div className="noti-header">
                <span className="noti-title-text">
                    알림
                    {unreadCount > 0 && (
                        <span className="noti-count">{unreadCount}</span>
                    )}
                </span>
                <div className="noti-header-actions">
                    {unreadCount > 0 && (
                        <button className="noti-read-all" onClick={handleReadAll}>
                            전체 읽음
                        </button>
                    )}
                    <button className="noti-close-btn" onClick={onClose}>
                        <FiX size={18} />
                    </button>
                </div>
            </div>

            {/* 바디 */}
            <div className="noti-body">
                {notifications.length === 0 ? (
                    <div className="noti-empty">새로운 알림이 없어요</div>
                ) : (
                    notifications.map((noti) => {
                        const config = TYPE_CONFIG[noti.type] ?? { icon: "🔔", label: "알림", color: "gray" };
                        return (
                            <div
                                key={noti.id}
                                className={`noti-item noti-color-${config.color} ${!noti.read ? "unread" : ""} ${noti.link ? "clickable" : ""}`}
                                onClick={() => handleClick(noti)}
                            >
                                <div className="noti-icon-wrap">
                                    <span className="noti-icon">{config.icon}</span>
                                </div>
                                <div className="noti-content">
                                    <div className="noti-top-row">
                                        <span className={`noti-type-badge noti-badge-${config.color}`}>
                                            {config.label}
                                        </span>
                                        <span className="noti-time">{noti.time}</span>
                                    </div>
                                    <p className="noti-message">{noti.message}</p>
                                </div>
                                {!noti.read && <div className="noti-dot" />}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default NotificationList;