import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatPage.css";
import { fetchChatRooms, fetchChatMessages, sendMessage } from "../api/chat";
import { FiSend, FiArrowLeft } from "react-icons/fi";

function ChatPage() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const bodyRef = useRef(null);

    // 채팅방 목록 로드
    useEffect(() => {
        const load = async () => {
            setLoadingRooms(true);
            try {
                const data = await fetchChatRooms();
                setRooms(data);
            } catch (e) {
                console.error("채팅방 목록 로드 실패:", e);
            } finally {
                setLoadingRooms(false);
            }
        };
        load();
    }, []);

    // 채팅방 선택 시 메시지 로드
    useEffect(() => {
        if (!activeRoom) return;
        const load = async () => {
            setLoadingMessages(true);
            try {
                const data = await fetchChatMessages(activeRoom.id);
                setMessages(data);
            } catch (e) {
                console.error("메시지 로드 실패:", e);
                setMessages([
                    { id: 1, type: "system", text: `[${activeRoom.title}] 입장했습니다.` },
                ]);
            } finally {
                setLoadingMessages(false);
            }
        };
        load();
    }, [activeRoom]);

    // 새 메시지 자동 스크롤
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSelectRoom = (room) => {
        setActiveRoom(room);
        setShowChat(true);
    };

    const handleSend = async () => {
        if (!inputValue.trim() || !activeRoom) return;
        const newMsg = { id: Date.now(), type: "me", text: inputValue.trim() };
        setMessages((prev) => [...prev, newMsg]);
        setInputValue("");
        try {
            await sendMessage(activeRoom.id, inputValue.trim());
        } catch (e) {
            console.error("메시지 전송 실패:", e);
        }
    };

    return (
        <div className="chat-page">

            {/* 채팅방 목록 */}
            <aside className={`chat-page-sidebar ${showChat ? "hide-mobile" : ""}`}>
                <div className="chat-page-sidebar-header">
                    <button className="chat-page-nav-back" onClick={() => navigate(-1)}>
                        <FiArrowLeft size={18} />
                    </button>
                    <h3>채팅</h3>
                </div>

                <div className="chat-page-room-list">
                    {loadingRooms && (
                        <div className="chat-page-status">불러오는 중...</div>
                    )}
                    {!loadingRooms && rooms.length === 0 && (
                        <div className="chat-page-status">참여 중인 채팅방이 없어요</div>
                    )}
                    {!loadingRooms && rooms.map((room) => (
                        <div
                            key={room.id}
                            className={`chat-page-room-item ${activeRoom?.id === room.id ? "active" : ""} ${room.unread > 0 ? "unread" : ""}`}
                            onClick={() => handleSelectRoom(room)}
                        >
                            <div className="chat-page-room-avatar">
                                {room.title[0]}
                            </div>
                            <div className="chat-page-room-info">
                                <div className="chat-page-room-title-row">
                                    <span className="chat-page-room-name">{room.title}</span>
                                    <span className="chat-page-room-time">{room.time}</span>
                                </div>
                                <div className="chat-page-room-last">{room.lastMessage}</div>
                            </div>
                            {room.unread > 0 && (
                                <div className="chat-page-room-badge">{room.unread}</div>
                            )}
                        </div>
                    ))}
                </div>
            </aside>

            {/* 채팅 영역 */}
            <main className={`chat-page-main ${!showChat ? "hide-mobile" : ""}`}>
                {!activeRoom ? (
                    <div className="chat-page-empty">
                        <p>채팅방을 선택해주세요</p>
                    </div>
                ) : (
                    <>
                        <div className="chat-page-header">
                            <button
                                className="chat-page-back-btn"
                                onClick={() => setShowChat(false)}
                            >
                                <FiArrowLeft size={20} />
                            </button>
                            <h4>{activeRoom.title}</h4>
                        </div>

                        <div className="chat-page-body" ref={bodyRef}>
                            {loadingMessages && (
                                <div className="chat-page-status">불러오는 중...</div>
                            )}
                            {!loadingMessages && messages.map((msg) => (
                                <div key={msg.id} className={`chat-page-msg ${msg.type}`}>
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        <div className="chat-page-footer">
                            <textarea
                                placeholder="메시지를 입력하세요..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />
                            <button onClick={handleSend}>
                                <FiSend size={16} />
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default ChatPage;