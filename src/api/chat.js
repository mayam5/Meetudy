import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const BASE_URL = "http://localhost:8080";

const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

// 채팅방 목록 조회
export const fetchChatRooms = async () => {
    const res = await fetch(`${BASE_URL}/chats/me`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data.map((room) => ({
        id: room.chatRoomId,
        title: room.groupName,
        lastMessage: "",
        time: "",
        unread: 0,
    }));
};

// 메시지 목록 조회
export const fetchChatMessages = async (roomId, page = 0, size = 30) => {
    const res = await fetch(
        `${BASE_URL}/chats/${roomId}/messages?page=${page}&size=${size}`,
        { headers: authHeader() }
    );
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);

    const myId = Number(localStorage.getItem("userId"));
    return json.data.content.map((msg) => ({
        id: msg.messageId,
        type: msg.senderId === myId ? "me" : "other",
        text: msg.messageContent,
        nickname: msg.senderNickname,
    }));
};

// 읽음 처리
export const markAsRead = async (roomId) => {
    await fetch(`${BASE_URL}/chats/${roomId}/read`, {
        method: "PATCH",
        headers: authHeader(),
    });
};

// STOMP 클라이언트 생성
export const createStompClient = () =>
    new Client({
        webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
        connectHeaders: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        reconnectDelay: 5000,
    });

// 메시지 전송 (WebSocket)
export const sendStompMessage = (client, roomId, text) => {
    client.publish({
        destination: "/app/chat.send",
        body: JSON.stringify({
            chatRoomId: roomId,
            messageContent: text,
            messageType: "TEXT",
        }),
    });
};
