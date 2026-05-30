const BASE_URL = "http://localhost:8080";

const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

const DAY_MAP = { 월: "MON", 화: "TUE", 수: "WED", 목: "THU", 금: "FRI", 토: "SAT", 일: "SUN" };
const TIME_MAP = { 새벽: 1, 아침: 2, 오후: 3, 저녁: 4 };

export const fetchMySchedules = async () => {
    const res = await fetch(`${BASE_URL}/schedules/me`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data;
};



export const fetchMyProfile = async () => {
    const res = await fetch(`${BASE_URL}/users/me`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    const p = json.data;
    return {
        email: p.email ?? "",
        nickname: p.nickname ?? "",
        birth: p.birthDate ?? "2000-01-01",
        gender: p.gender ?? "F",
        bio: p.bio ?? "",
        categories: [],
        agePublic: p.isAgePublic ?? false,
    };
};

export const updateMyProfile = async (payload) => {
    const res = await fetch(`${BASE_URL}/users/me`, {
        method: "PATCH",
        headers: authHeader(),
        body: JSON.stringify({
            nickname: payload.nickname,
            bio: payload.bio,
            gender: payload.gender,
            birthDate: payload.birth,
            isAgePublic: payload.agePublic,
        }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data;
};

export const changePassword = async ({ current, newPassword }) => {
    const res = await fetch(`${BASE_URL}/users/me`, {
        method: "PATCH",
        headers: authHeader(),
        body: JSON.stringify({ currentPassword: current, newPassword }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data;
};

export const fetchUserById = async (id) => {
    const res = await fetch(`${BASE_URL}/users/${id}`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data;
};

export const fetchBlockedUsers = async () => {
    const res = await fetch(`${BASE_URL}/users/block`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data.map((u) => ({
        id: u.blockedUserId,
        host: u.blockedNickname,
        field: "",
        blocked: true,
    }));
};

export const toggleBlockUser = async (userId, isCurrentlyBlocked) => {
    const method = isCurrentlyBlocked ? "DELETE" : "POST";
    const res = await fetch(`${BASE_URL}/users/block/${userId}`, {
        method,
        headers: authHeader(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data;
};

export const fetchBookmarks = async () => {
    const res = await fetch(`${BASE_URL}/posts/bookmarks`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data.map((b) => ({
        id: b.postId,
        title: b.postTitle,
        host: b.nickname ?? "",
        field: b.categoryName ?? "",
    }));
};

export const toggleBookmark = async (postId, isCurrentlyBookmarked) => {
    const method = isCurrentlyBookmarked ? "DELETE" : "POST";
    const res = await fetch(`${BASE_URL}/posts/${postId}/bookmark`, {
        method,
        headers: authHeader(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data;
};

export const updateSchedule = async (schedule) => {
    const schedules = schedule
        .map((key) => {
            const [day, time] = key.split("-");
            return { dayOfWeek: DAY_MAP[day], timeSlotId: TIME_MAP[time] };
        })
        .filter((s) => s.dayOfWeek && s.timeSlotId);

    const res = await fetch(`${BASE_URL}/schedules`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({ schedules }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data;
};
