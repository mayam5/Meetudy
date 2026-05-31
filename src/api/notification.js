const BASE_URL = "http://localhost:8080";

const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

const formatTime = (createdAt) => {
    if (!createdAt) return "";
    const diff = Date.now() - new Date(createdAt).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "방금";
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    return `${Math.floor(hours / 24)}일 전`;
};

export const fetchNotifications = async () => {
    const res = await fetch(`${BASE_URL}/notifications/me`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data.map((n) => ({
        id: n.id,
        type: n.type,
        message: n.message,
        read: n.read,
        time: formatTime(n.createdAt),
    }));
};

export const markNotificationRead = async (id) => {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: authHeader(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data;
};

export const markAllNotificationsRead = async () => {
    const res = await fetch(`${BASE_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: authHeader(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data;
};
