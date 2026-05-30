import axios from "axios";
import { ALL_STUDIES, DUMMY_STUDIES } from "../data/dummyData";

const BASE_URL = "http://localhost:8080";

const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const fetchAllStudies = async ({ search, region, field, page = 1, limit = 10 } = {}) => {
    // TODO: 백엔드 연동
    let filtered = [...DUMMY_STUDIES];
    if (search) filtered = filtered.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));
    if (region && region !== "지역") filtered = filtered.filter((s) => s.region === region);
    if (field && field !== "분야") filtered = filtered.filter((s) => s.field === field);
    return { data: filtered.slice((page - 1) * limit, page * limit), total: filtered.length };
};

// 내가 작성한 게시글
export const fetchMyStudies = async () => {
    const res = await fetch(`${BASE_URL}/posts/me`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return {
        data: json.data.map((p) => ({
            id: p.postId,
            title: p.postTitle,
            host: p.nickname ?? "",
            field: p.categoryName ?? "",
            users: [],
        })),
    };
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

export const fetchPendingStudies = async ({ page = 1, limit = 10 } = {}) => {
    // TODO: 백엔드 연동
    const data = DUMMY_STUDIES.slice(6, 9);
    return { data: data.slice((page - 1) * limit, page * limit), total: data.length };
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

export const fetchBookmarkedStudies = async ({ page = 1, limit = 10 } = {}) => {
    // TODO: 백엔드 연동
    const data = DUMMY_STUDIES.slice(1, 4);
    return { data: data.slice((page - 1) * limit, page * limit), total: data.length };
};

export const fetchStudyById = async (id) => {
    // TODO: 백엔드 연동
    return DUMMY_STUDIES.find((s) => s.id === Number(id)) ?? null;
};

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

export const updateStudy = async (id, payload) => {
    // TODO: 백엔드 연동
    console.log("updateStudy:", id, payload);
    return { success: true };
};

export const deleteStudy = async (id) => {
    // TODO: 백엔드 연동
    console.log("deleteStudy:", id);
    return { success: true };
};

export const applyToStudy = async (id) => {
    // TODO: 백엔드 연동
    console.log("applyToStudy:", id);
    return { success: true };
};

export const cancelApplication = async (id) => {
    // TODO: 백엔드 연동
    console.log("cancelApplication:", id);
    return { success: true };
};

export const fetchRecommendedStudies = async () => {
    // TODO: 백엔드 연동
    return ALL_STUDIES.slice(0, 3);
};

export const fetchStudyPreview = async () => {
    // TODO: 백엔드 연동
    return ALL_STUDIES.slice(0, 5);
};

export const fetchMyStudyRelation = async (studyId) => {
    // TODO: 백엔드 연동
    const myStudyIds = [1, 2];
    const joinedIds = [3];
    const pendingIds = [4];
    const rejectedIds = [5];
    const numId = Number(studyId);
    if (myStudyIds.includes(numId)) return "owned";
    if (joinedIds.includes(numId)) return "joined";
    if (pendingIds.includes(numId)) return "pending";
    if (rejectedIds.includes(numId)) return "rejected";
    return "none";
};
