import "./ChatList.css";
import { FiX } from "react-icons/fi";

const DEFAULT_ROOMS = [
    {
        id: 1,
        title: "React 초보 스터디",
        lastMessage: "오늘 과제 어디까지인가요?",
        time: "2m",
        unread: 2
    },
    {
        id: 2,
        title: "알고리즘 1일 1문제",
        lastMessage: "방금 깃허브에 인증했습니다!",
        time: "10m",
        unread: 0
    },
    {
        id: 3,
        title: "토익 스피킹 메이트",
        lastMessage: "녹음본 확인 부탁드려요.",
        time: "1h",
        unread: 1
    }
];

function ChatList({ onSelectRoom, onClose, rooms = DEFAULT_ROOMS }) {
    return (
        <div className="chat-list-dropdown">
            <div className="chat-list-header">
                <span>내 참여 모임</span>
                <button className="chat-close-btn" onClick={onClose}>
                    <FiX size={18} />
                </button>
            </div>

            <div className="chat-list-body">
                {rooms.length === 0 ? (
                    <div className="chat-list-empty">
                        참여 중인 모임이 없어요
                    </div>
                ) : (
                    rooms.map((room) => (
                        <div
                            key={room.id}
                            className={`chat-list-item ${room.unread > 0 ? "unread" : ""}`}
                            onClick={() => onSelectRoom?.(room)}
                        >
                            <div className="room-avatar">
                                {room.title[0]}
                            </div>

                            <div className="room-content">
                                <div className="room-title">
                                    {room.title}
                                    <span className="room-time">{room.time}</span>
                                </div>
                                <div className="room-last-msg">
                                    {room.lastMessage}
                                </div>
                            </div>

                            {room.unread > 0 && (
                                <div className="room-badge">
                                    {room.unread}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ChatList;