import { DUMMY_NOTIFICATIONS } from "../data/dummyData";

export const fetchNotifications = async () => {
    // TODO: return await axios.get("/api/notifications");
    return DUMMY_NOTIFICATIONS;
};

export const markNotificationRead = async (id) => {
    // TODO: return await axios.put(`/api/notifications/${id}/read`);
    return { success: true };
};

export const markAllNotificationsRead = async () => {
    // TODO: return await axios.put("/api/notifications/read-all");
    return { success: true };
};