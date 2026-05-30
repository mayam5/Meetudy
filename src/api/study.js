import axios from "axios";

const BASE_URL = "http://localhost:8080";

const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

const mapPost = (p) => ({
    id: p.postId,
    title: p.postTitle,
    host: p.nickname ?? "",
    field: p.categoryName ?? "",
    description: p.postContent ?? "",
    maxMembers: p.maxMembers ?? 0,
    currentMembers: p.currentMembers ?? 0,
    place: p.placeName ?? "",
    status: p.postStatus ?? "recruiting",
    meetingTimes: p.dayOfWeek && p.timeSlotName ? [`${p.dayOfWeek} ${p.timeSlotName}`] : [],
    users: [],
    tags: p.categoryName ? [p.categoryName] : [],
});

// 전체 게시글 목록
export const fetchAllStudies = async ({ search, field, page = 1, limit = 10, signal } = {}) => {
    const params = new URLSearchParams();
    if (search) params.set("keyword", search);

    const res = await fetch(`${BASE_URL}/posts?${params}`, { headers: authHeader(), signal });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);

    let mapped = json.data.map(mapPost);
    if (field) mapped = mapped.filter((p) => p.field === field);

    const start = (page - 1) * limit;
    return { data: mapped.slice(start, start + limit), total: mapped.length };
};

// 내가 작성한 게시글
export const fetchMyStudies = async () => {
    const res = await fetch(`${BASE_URL}/posts/me`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return { data: json.data.map(mapPost) };
};

// 참여 중인 스터디 그룹
export const fetchJoinedStudies = async () => {
    const res = await fetch(`${BASE_URL}/study-groups/me`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return {
        data: json.data.map((g) => ({
            id: g.studyGroupId,
            title: g.groupName,
            host: "",
            field: "",
            users: [],
        })),
    };
};

// 신청한 스터디 목록
export const fetchAppliedStudies = async () => {
    const res = await fetch(`${BASE_URL}/applications/me`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return {
        data: json.data.map((a) => ({
            id: a.postId,
            title: a.postTitle,
            host: "",
            field: "",
            users: [],
            applicationStatus: a.status?.toLowerCase(),
        })),
    };
};

// 북마크한 게시글 목록
export const fetchBookmarkedStudies = async ({ page = 1, limit = 10 } = {}) => {
    const res = await fetch(`${BASE_URL}/posts/bookmarks`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    const mapped = json.data.map(mapPost);
    const start = (page - 1) * limit;
    return { data: mapped.slice(start, start + limit), total: mapped.length };
};

// 게시글 단건 조회
export const fetchStudyById = async (id) => {
    const res = await fetch(`${BASE_URL}/posts/${id}`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return mapPost(json.data);
};

// 게시글 작성
export const createStudy = async (payload) => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(`${BASE_URL}/posts`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success === false) {
        throw new Error(response.data.message || "게시글 작성 실패");
    }
    return response.data.data ?? response.data;
};

// 게시글 수정
export const updateStudy = async (id, payload) => {
    const res = await fetch(`${BASE_URL}/posts/${id}`, {
        method: "PATCH",
        headers: authHeader(),
        body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data;
};

// 게시글 삭제
export const deleteStudy = async (id) => {
    const res = await fetch(`${BASE_URL}/posts/${id}`, {
        method: "DELETE",
        headers: authHeader(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data;
};

// 스터디 신청
export const applyToStudy = async (postId) => {
    const res = await fetch(`${BASE_URL}/applications`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ postId: Number(postId) }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data;
};

// 신청 취소 (postId로 applicationId 조회 후 삭제)
export const cancelApplication = async (postId) => {
    const listRes = await fetch(`${BASE_URL}/applications/me`, { headers: authHeader() });
    const listJson = await listRes.json();
    if (!listRes.ok || !listJson.success) throw new Error(listJson.message);

    const app = listJson.data.find((a) => a.postId === Number(postId));
    if (!app) throw new Error("신청 내역을 찾을 수 없습니다.");

    const res = await fetch(`${BASE_URL}/applications/${app.applicationId}`, {
        method: "DELETE",
        headers: authHeader(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data;
};

// 내 관계 조회: owned | pending | accepted | rejected | joined | none
export const fetchMyStudyRelation = async (postId) => {
    const myId = Number(localStorage.getItem("userId"));
    if (!myId) return "none";

    const numId = Number(postId);

    const [postsRes, appsRes, groupsRes] = await Promise.all([
        fetch(`${BASE_URL}/posts/me`, { headers: authHeader() }),
        fetch(`${BASE_URL}/applications/me`, { headers: authHeader() }),
        fetch(`${BASE_URL}/study-groups/me`, { headers: authHeader() }),
    ]);

    const [postsJson, appsJson, groupsJson] = await Promise.all([
        postsRes.json(),
        appsRes.json(),
        groupsRes.json(),
    ]);

    if (postsJson.success && postsJson.data.some((p) => p.postId === numId)) return "owned";

    if (appsJson.success) {
        const app = appsJson.data.find((a) => a.postId === numId);
        if (app) {
            const s = app.status?.toUpperCase();
            if (s === "PENDING") return "pending";
            if (s === "ACCEPTED") return "accepted";
            if (s === "REJECTED") return "rejected";
        }
    }

    if (groupsJson.success && groupsJson.data.length > 0) return "joined";

    return "none";
};

export const fetchRecommendedStudies = async () => {
    const res = await fetch(`${BASE_URL}/posts`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) return [];
    return json.data.slice(0, 3).map(mapPost);
};

export const fetchStudyPreview = async () => {
    const res = await fetch(`${BASE_URL}/posts`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) return [];
    return json.data.slice(0, 5).map(mapPost);
};
