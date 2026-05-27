import "./Chat.css";
import { FiX } from "react-icons/fi";

function Chat({ onClose, roomTitle = "채팅방" }) {

    const messages = [
        { id: 1, type: "system", text: `[${roomTitle}] 입장했습니다.` },
        { id: 2, type: "other", text: "안녕하세요!" },
        { id: 3, type: "me", text: "네 반갑습니다 👋" },
    ];

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
            <div className="chat-card-body">
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
                <textarea placeholder="메시지를 입력하세요..." />
                <button>전송</button>
            </div>

        </div>
    );
}

export default Chat;