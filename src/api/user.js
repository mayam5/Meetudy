// 백엔드 연동 시 아래 함수들의 return 부분을 axios/fetch로 교체하세요

export const fetchMyProfile = async () => {
    // TODO: return await axios.get("/api/users/me");
    return {
        email: localStorage.getItem("userEmail") || "",
        nickname: "Nickname",
        birth: "2000-01-01",
        gender: "F",
        bio: "안녕하세요!",
        categories: ["분야1", "분야2"],
        agePublic: false,
    };
};

export const updateMyProfile = async (payload) => {
    // TODO: return await axios.put("/api/users/me", payload);
    console.log("updateMyProfile:", payload);
    return { success: true };
};

export const changePassword = async ({ current, newPassword }) => {
    // TODO: return await axios.put("/api/users/me/password", { current, newPassword });
    console.log("changePassword");
    return { success: true };
};

export const fetchUserById = async (id) => {
    // TODO: return await axios.get(`/api/users/${id}`);
    return { id, nickname: "닉네임", bio: "소개글이에요.", field: "개발" };
};

export const fetchBlockedUsers = async () => {
    // TODO: return await axios.get("/api/users/blocked");
    return [
        { id: 1, host: "닉네임1", field: "분야", blocked: true },
        { id: 2, host: "닉네임2", field: "분야", blocked: true },
    ];
};

export const toggleBlockUser = async (userId, blocked) => {
    // TODO: return await axios.put(`/api/users/block/${userId}`, { blocked });
    return { success: true };
};

export const fetchBookmarks = async () => {
    // TODO: return await axios.get("/api/users/bookmarks");
    return [
        { id: 1, title: "React 스터디", host: "김예빈", field: "개발" },
        { id: 2, title: "토익 스터디", host: "홍길동", field: "외국어" },
        { id: 3, title: "알고리즘 스터디", host: "철수", field: "개발" },
    ];
};

export const toggleBookmark = async (studyId) => {
    // TODO: return await axios.post(`/api/users/bookmarks/${studyId}`);
    return { success: true };
};

// 스케줄 저장
export const updateSchedule = async (schedule) => {
    // TODO: return await axios.put("/api/users/me/schedule", { schedule });
    console.log("updateSchedule:", schedule);
    return { success: true };
};