import "./NotificationList.css";
import { FiX } from "react-icons/fi";
import { markAllNotificationsRead } from "../api/notification";


const TYPE_ICON = {
    accepted: "✅",
    rejected: "❌",
    apply: "📩",
    chat: "💬",
};

function NotificationList({ onClose, notifications = [], onRead, onReadAll }) {
    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleReadAll = async () => {
        try {
            await markAllNotificationsRead();
            onReadAll?.();
        } catch (e) {
            console.error("전체 읽음 처리 실패:", e);
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
                    notifications.map((noti) => (
                        <div
                            key={noti.id}
                            className={`noti-item ${!noti.read ? "unread" : ""}`}
                            onClick={() => onRead?.(noti.id)}
                        >
                            <span className="noti-icon">
                                {TYPE_ICON[noti.type] ?? "🔔"}
                            </span>
                            <div className="noti-content">
                                <p className="noti-message">{noti.message}</p>
                                <span className="noti-time">{noti.time}</span>
                            </div>
                            {!noti.read && <div className="noti-dot" />}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default NotificationList;