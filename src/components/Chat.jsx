import "./Chat.css";
import { FiX, FiSend } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { fetchChatMessages, sendMessage } from "../api/chat";

function Chat({ onClose, roomTitle = "채팅방", roomId }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const bodyRef = useRef(null);

    // 메시지 로드
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchChatMessages(roomId);
                setMessages(data);
            } catch (e) {
                setMessages([
                    { id: 1, type: "system", text: `[${roomTitle}] 입장했습니다.` },
                ]);
            }
        };
        load();
    }, [roomId, roomTitle]);

    // 자동 스크롤
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        const newMsg = { id: Date.now(), type: "me", text: inputValue.trim() };
        setMessages((prev) => [...prev, newMsg]);
        setInputValue("");
        try {
            await sendMessage(roomId, inputValue.trim());
        } catch (e) {
            console.error("메시지 전송 실패:", e);
        }
    };

    return (
        <div className="chat-card">
            <div className="chat-card-header">
                <h3>{roomTitle}</h3>
                <button className="close-btn" onClick={onClose}>
                    <FiX size={18} />
                </button>
            </div>

            <div className="chat-card-body" ref={bodyRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`chat-msg ${msg.type}`}>
                        {msg.text}
                    </div>
                ))}
            </div>

            <div className="chat-card-footer">
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
        </div>
    );
}

export default Chat;