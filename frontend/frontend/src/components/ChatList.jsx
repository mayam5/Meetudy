import "./ChatList.css";
import { FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { fetchChatRooms } from "../api/chat";

function ChatList({ onSelectRoom, onClose }) {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchChatRooms();
                setRooms(data);
            } catch (e) {
                console.error("채팅방 목록 로드 실패:", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="chat-list-dropdown">
            <div className="chat-list-header">
                <span>내 채팅방 목록</span>
                <button className="chat-close-btn" onClick={onClose}>
                    <FiX size={18} />
                </button>
            </div>

            <div className="chat-list-body">
                {loading && (
                    <div className="chat-list-empty">불러오는 중...</div>
                )}
                {!loading && rooms.length === 0 && (
                    <div className="chat-list-empty">참여 중인 모임이 없어요</div>
                )}
                {!loading && rooms.map((room) => (
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
                            <div className="room-badge">{room.unread}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChatList;