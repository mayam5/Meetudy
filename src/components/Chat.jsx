import "./Chat.css";
import { FiX, FiSend } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";

function Chat({ onClose, roomTitle = "채팅방" }) {

    const [messages, setMessages] = useState([
        { id: 1, type: "system", text: `[${roomTitle}] 입장했습니다.` },
    ]);
    const [inputValue, setInputValue] = useState("");
    const bodyRef = useRef(null);

    // 새 메시지 오면 자동 스크롤
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        setMessages((prev) => [
            ...prev,
            { id: Date.now(), type: "me", text: inputValue.trim() }
        ]);
        setInputValue("");
    };

    return (
        <div className="chat-card">

            {/* HEADER */}
            <div className="chat-card-header">
                <h3>{roomTitle}</h3>
                <button className="close-btn" onClick={onClose}>
                    <FiX size={18} />
                </button>
            </div>

            {/* BODY */}
            <div className="chat-card-body" ref={bodyRef}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`chat-msg ${msg.type}`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* FOOTER */}
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