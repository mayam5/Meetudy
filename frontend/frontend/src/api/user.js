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

    // 지역 문자열 "서울특별시 강남구 역삼동" → { sido, sigungu, dong }
    const regionParts = (p.region ?? "").split(" ");
    const region = {
        sido: regionParts[0] ?? "",
        sigungu: regionParts[1] ?? "",
        dong: regionParts[2] ?? "",
    };

    return {
        email: p.email ?? "",
        nickname: p.nickname ?? "",
        birth: p.birthDate ?? "",
        gender: p.gender ?? "",
        bio: p.bio ?? "",
        // 백엔드가 카테고리 이름 배열로 주면 그대로, 객체 배열이면 name 추출
        categories: (p.categories ?? []).map((c) =>
            typeof c === "string" ? c : (c.categoryName ?? c.name ?? "")
        ),
        agePublic: p.isAgePublic ?? false,
        profileImage: p.profileImage ?? null,
        region,
    };
};

export const updateMyProfile = async (payload) => {
    const regionStr = [payload.region?.sido, payload.region?.sigungu, payload.region?.dong]
        .filter(Boolean)
        .join(" ");

    const res = await fetch(`${BASE_URL}/users/me`, {
        method: "PATCH",
        headers: authHeader(),
        body: JSON.stringify({
            nickname: payload.nickname || undefined,
            bio: payload.bio,
            gender: payload.gender,
            birthDate: payload.birth,
            isAgePublic: payload.agePublic,
            region: regionStr || undefined,
        }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data;
};

// 비밀번호 변경은 별도 엔드포인트 사용 (백엔드 스펙에 따라 경로 조정)
export const changePassword = async ({ current, newPassword }) => {
    if (newPassword.length < 8) throw new Error("비밀번호는 8자 이상이어야 합니다.");
    const res = await fetch(`${BASE_URL}/users/me/password`, {
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
    const res = await fetch(`${BASE_URL}/posts/bookmarks`, {
        headers: authHeader(),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || "북마크 목록 조회 실패");
    }

    return {
        data: json.map((b) => ({
            id: b.postId,
            title: b.postTitle,
            description: b.postContent,
            host: b.nickname ?? "",
            hostId: b.userId,
            field: b.categoryName ?? "",
            place: b.placeName ?? "",
            categoryId: b.categoryId,
            tags: b.categoryName ? [b.categoryName] : [],
            isBookmarked: b.bookmarked,
            currentMembers: b.currentMembers ?? 0,
            maxMembers: b.maxMembers ?? 0,
        })),
        total: json.length,
    };
};

export const toggleBookmark = async (postId, isBookmarked) => {
    const res = await fetch(`${BASE_URL}/posts/${postId}/bookmark`, {
        method: isBookmarked ? "DELETE" : "POST",
        headers: authHeader(),
    });

    if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "북마크 변경 실패");
    }

    // 응답 body가 비어있을 수 있으므로 안전하게 처리
    const text = await res.text();
    return text ? JSON.parse(text) : {};
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