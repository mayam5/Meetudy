import { DUMMY_ROOMS } from "../data/dummyData";

// 채팅방 목록 조회
export const fetchChatRooms = async () => {
    // TODO: return await axios.get("/api/chat/rooms");
    return DUMMY_ROOMS;
};

// 채팅방 메시지 조회
export const fetchChatMessages = async (roomId) => {
    // TODO: return await axios.get(`/api/chat/rooms/${roomId}/messages`);
    return [
        { id: 1, type: "system", text: "채팅방에 입장했습니다." },
        { id: 2, type: "other", text: "안녕하세요!" },
        { id: 3, type: "me", text: "네 반갑습니다 👋" },
    ];
};

// 메시지 전송
export const sendMessage = async (roomId, text) => {
    // TODO: return await axios.post(`/api/chat/rooms/${roomId}/messages`, { text });
    console.log("sendMessage:", roomId, text);
    return { success: true };
};