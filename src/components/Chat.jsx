import "./Chat.css";
import { FiX, FiSend } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { fetchChatMessages, createStompClient, sendStompMessage } from "../api/chat";

function Chat({ onClose, roomTitle = "채팅방", roomId }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const bodyRef = useRef(null);
    const stompClientRef = useRef(null);
    const subscriptionRef = useRef(null);

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

    // STOMP 연결
    useEffect(() => {
        if (!roomId) return;
        const client = createStompClient();
        stompClientRef.current = client;

        client.onConnect = () => {
            subscriptionRef.current = client.subscribe(
                `/user/queue/chat.${roomId}`,
                (frame) => {
                    const msg = JSON.parse(frame.body);
                    const myId = Number(localStorage.getItem("userId"));
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: msg.messageId ?? Date.now(),
                            type: msg.senderId === myId ? "me" : "other",
                            text: msg.messageContent,
                            nickname: msg.senderNickname,
                        },
                    ]);
                }
            );
        };

        client.activate();

        return () => {
            subscriptionRef.current?.unsubscribe();
            client.deactivate();
        };
    }, [roomId]);

    // 자동 스크롤
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim() || !stompClientRef.current?.connected) return;
        sendStompMessage(stompClientRef.current, roomId, inputValue.trim());
        setInputValue("");
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
                        {msg.type === "other" && msg.nickname && (
                            <span className="chat-msg-nickname">{msg.nickname}: </span>
                        )}
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