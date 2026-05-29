import { ALL_STUDIES, DUMMY_STUDIES } from "../data/dummyData";

export const fetchAllStudies = async ({ search, region, field, page = 1, limit = 10 } = {}) => {
    // TODO: return await axios.get("/api/studies", { params: { search, region, field, page, limit } });
    let filtered = [...DUMMY_STUDIES];
    if (search) filtered = filtered.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));
    if (region && region !== "지역") filtered = filtered.filter((s) => s.region === region);
    if (field && field !== "분야") filtered = filtered.filter((s) => s.field === field);
    return { data: filtered.slice((page - 1) * limit, page * limit), total: filtered.length };
};

export const fetchMyStudies = async ({ page = 1, limit = 10 } = {}) => {
    // TODO: return await axios.get("/api/studies/my", { params: { page, limit } });
    const data = DUMMY_STUDIES.slice(0, 3);
    return { data: data.slice((page - 1) * limit, page * limit), total: data.length };
};

export const fetchJoinedStudies = async ({ page = 1, limit = 10 } = {}) => {
    // TODO: return await axios.get("/api/studies/joined", { params: { page, limit } });
    const data = DUMMY_STUDIES.slice(3, 6);
    return { data: data.slice((page - 1) * limit, page * limit), total: data.length };
};

export const fetchPendingStudies = async ({ page = 1, limit = 10 } = {}) => {
    // TODO: return await axios.get("/api/studies/pending", { params: { page, limit } });
    const data = DUMMY_STUDIES.slice(6, 9);
    return { data: data.slice((page - 1) * limit, page * limit), total: data.length };
};

export const fetchAppliedStudies = async ({ page = 1, limit = 10 } = {}) => {
    // TODO: return await axios.get("/api/studies/applied", { params: { page, limit } });
    const data = DUMMY_STUDIES.slice(0, 3).map((s, i) => ({
        ...s,
        applicationStatus: i === 0 ? "accepted" : i === 1 ? "rejected" : "pending",
    }));
    return { data: data.slice((page - 1) * limit, page * limit), total: data.length };
};

export const fetchBookmarkedStudies = async ({ page = 1, limit = 10 } = {}) => {
    // TODO: return await axios.get("/api/studies/bookmarked", { params: { page, limit } });
    const data = DUMMY_STUDIES.slice(1, 4);
    return { data: data.slice((page - 1) * limit, page * limit), total: data.length };
};

export const fetchStudyById = async (id) => {
    // TODO: return await axios.get(`/api/studies/${id}`);
    return DUMMY_STUDIES.find((s) => s.id === Number(id)) ?? null;
};

export const createStudy = async (payload) => {
    // TODO: return await axios.post("/api/studies", payload);
    console.log("createStudy:", payload);
    return { success: true };
};

export const updateStudy = async (id, payload) => {
    // TODO: return await axios.put(`/api/studies/${id}`, payload);
    console.log("updateStudy:", id, payload);
    return { success: true };
};

export const deleteStudy = async (id) => {
    // TODO: return await axios.delete(`/api/studies/${id}`);
    console.log("deleteStudy:", id);
    return { success: true };
};

export const applyToStudy = async (id) => {
    // TODO: return await axios.post(`/api/studies/${id}/apply`);
    console.log("applyToStudy:", id);
    return { success: true };
};

export const cancelApplication = async (id) => {
    // TODO: return await axios.delete(`/api/studies/${id}/apply`);
    console.log("cancelApplication:", id);
    return { success: true };
};

export const fetchRecommendedStudies = async () => {
    // TODO: return await axios.get("/api/studies/recommended");
    return ALL_STUDIES.slice(0, 3);
};

export const fetchStudyPreview = async () => {
    // TODO: return await axios.get("/api/studies/preview");
    return ALL_STUDIES.slice(0, 5);
};

export const fetchMyStudyRelation = async (studyId) => {
    // TODO: return await axios.get(`/api/studies/${studyId}/my-relation`);

    // 더미 - 내가 작성한 스터디 id 목록 (실제 연동 시 삭제)
    const myStudyIds = [1, 2]; // 내가 작성한 스터디 id
    const joinedIds = [3];     // 참여 중인 스터디 id
    const pendingIds = [4];    // 신청 대기 중
    const rejectedIds = [5];   // 거절된 스터디 id

    const numId = Number(studyId);

    if (myStudyIds.includes(numId)) return "owned";
    if (joinedIds.includes(numId)) return "joined";
    if (pendingIds.includes(numId)) return "pending";
    if (rejectedIds.includes(numId)) return "rejected";
    return "none"; // 아무 관계 없음 → 신청하기 버튼
};