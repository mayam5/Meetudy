const BASE_URL = "http://localhost:8080";

const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

// PostResponse → 프론트 공통 형태 변환
const mapPost = (p) => ({
    id: p.postId,
    title: p.postTitle,
    host: p.nickname ?? "",
    hostId: p.userId,
    field: p.categoryName ?? "",
    categoryId: p.categoryId,
    description: p.postContent ?? "",
    maxMembers: p.maxMembers ?? 0,
    currentMembers: p.currentMembers ?? 0,
    place: p.placeName ?? "",
    dayOfWeek: p.dayOfWeek ?? "",
    timeSlotId: p.timeSlotId,
    timeSlotName: p.timeSlotName ?? "",
    status: p.postStatus ?? "OPEN",
    users: [],
    tags: p.categoryName ? [p.categoryName] : [],
    isBookmarked: Boolean(p.bookmarked ?? p.isBookmarked),
});

const paginate = (items, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    total: items.length,
  };
};


/** POST-15: 전체 게시글 목록 GET /posts */
export const fetchAllStudies = async ({
  search,
  field,
  region,
  page = 1,
  limit = 10,
  signal,
} = {}) => {
  const params = new URLSearchParams();
  if (search) params.set("keyword", search);

  const res = await fetch(`${BASE_URL}/posts?${params}`, {
    headers: authHeader(),
    signal,
  });

  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message);

  let mapped = await Promise.all(
    (json.data ?? []).map(async (p) => {
      let users = [p.nickname ?? ""];
      try {
        const memberRes = await fetch(`${BASE_URL}/posts/${p.postId}/members`);
        const memberData = await memberRes.json();
        if (memberData.data?.length > 0) {
          users = memberData.data.map((m) => m.nickname);
        }
      } catch (e) {}
      return { ...mapPost(p), users };
    })
  );

  if (field) mapped = mapped.filter((p) => p.field === field);
  if (region) mapped = mapped.filter((p) => p.region === region);

  const start = (page - 1) * limit;

  return {
    data: mapped.slice(start, start + limit),
    total: mapped.length,
  };
};


/** POST-17: 내 게시글 목록 GET /posts/me */
export const fetchMyStudies = async ({
  search,
  field,
  region,
  page = 1,
  limit = 10,
  signal,
} = {}) => {
  const res = await fetch(`${BASE_URL}/posts/me`, {
    headers: authHeader(),
    signal,
  });

  const json = await res.json();
  console.log("posts/me 응답:", json);

  if (!res.ok || !json.success) {
    throw new Error(json.message || "내 게시글 목록 조회 실패");
  }

  let mapped = (json.data ?? []).map(mapPost);


  if (search) {
    mapped = mapped.filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (field) {
    mapped = mapped.filter((p) => p.field === field);
  }

  if (region) {
    mapped = mapped.filter((p) => p.region === region);
  }

  const start = (page - 1) * limit;

  return {
    data: mapped.slice(start, start + limit),
    total: mapped.length,
  };
};


/** 참여 중인 스터디 그룹 GET /study-groups/me */
// StudyGroupResponse 필드: studyGroupId, postId, groupName, createdAt
export const fetchJoinedStudies = async () => {
    const res = await fetch(`${BASE_URL}/study-groups/me`, { headers: authHeader() });
    const json = await res.json();
     console.log("참여중 응답:", json.data);
    if (!res.ok || !json.success) throw new Error(json.message);
    return {
        data: (json.data ?? []).map((g) => ({
            id: g.postId,           // postId 기준으로 비교해야 relation 판단 가능
            groupId: g.studyGroupId,
            title: g.groupName,
            host: "",
            field: "",
            users: [],
            isBookmarked: Boolean(g.bookmarked ?? g.isBookmarked),
        })),
    };
};

/** 신청한 스터디 목록 GET /applications/me */
// ApplicationResponse 필드: applicationId, postId, postTitle, applicantId, applicantNickname, status, createdAt
export const fetchAppliedStudies = async () => {
    const res = await fetch(`${BASE_URL}/applications/me`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return {
        data: (json.data ?? []).map((a) => ({
            id: a.postId,
            applicationId: a.applicationId,
            title: a.postTitle,
            host: a.applicantNickname ?? "",
            field: "",
            users: [],
            applicationStatus: a.status?.toLowerCase(), // "PENDING" → "pending"
        })),
    };
};

/** 북마크한 게시글 목록 GET /posts/bookmarks */
export const fetchBookmarkedStudies = async ({ page = 1, limit = 10 } = {}) => {
    const res = await fetch(`${BASE_URL}/posts/bookmarks`, {
        headers: authHeader(),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error("북마크 목록 조회 실패");
    }

    const mapped = json.map(mapPost);
    const start = (page - 1) * limit;

    return {
        data: mapped.slice(start, start + limit),
        total: mapped.length,
    };
};

/** 게시글 단건 조회 GET /posts/:id */
export const fetchStudyById = async (id) => {
    const res = await fetch(`${BASE_URL}/posts/${id}`, { headers: authHeader() });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return mapPost(json.data);
};

/** 게시글 작성 POST /posts */
export const createStudy = async (payload) => {
    const res = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || "게시글 작성 실패");
    return json.data;
};

/** 게시글 수정 PATCH /posts/:id */
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

/** 게시글 삭제 DELETE /posts/:id */
export const deleteStudy = async (id) => {
    const res = await fetch(`${BASE_URL}/posts/${id}`, {
        method: "DELETE",
        headers: authHeader(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);
    return json.data;
};

/** 스터디 신청 POST /applications */
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

/** 신청 취소 - postId로 applicationId 찾아서 DELETE /applications/:id */
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

/** 스터디 그룹 나가기 PATCH /study-groups/:groupId/leave */
export const leaveStudyGroup = async (groupId) => {
  const res = await fetch(`${BASE_URL}/study-groups/${groupId}/leave`, {
      method: "PATCH",
      headers: authHeader(),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
      throw new Error(json.message);
  }

  return json.data;
};

/** 신청자 목록 조회 */
export const fetchPostApplications = async (postId, signal) => {
  const res = await fetch(`${BASE_URL}/posts/${postId}/applications`, {
    headers: authHeader(),
    signal,
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "신청자 목록 조회 실패");
  }

  return json.data ?? [];
};

/** 신청자 수락 */
export const acceptApplication = async (applicationId) => {
  const res = await fetch(`${BASE_URL}/applications/${applicationId}/accept`, {
    method: "PATCH",
    headers: authHeader(),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "신청 수락 실패");
  }

  return json.data;
};

/** 신청자 거절 */
export const rejectApplication = async (applicationId) => {
  const res = await fetch(`${BASE_URL}/applications/${applicationId}/reject`, {
    method: "PATCH",
    headers: authHeader(),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "신청 거절 실패");
  }

  return json.data;
};

/** 내 스터디 관계 조회: owned | pending | accepted | rejected | joined | none */
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

    // 내가 작성한 게시글인지
    if (postsJson.success && (postsJson.data ?? []).some((p) => p.postId === numId))
        return "owned";

    // 신청 상태 확인
    if (appsJson.success) {
        const app = (appsJson.data ?? []).find((a) => a.postId === numId);
        if (app) {
            const s = app.status?.toUpperCase();
            if (s === "ACCEPTED") return "accepted";
            if (s === "REJECTED") return "rejected";
            return "pending";
        }
    }

    // 참여 중인 그룹인지 (postId 기준 비교)
    if (groupsJson.success && (groupsJson.data ?? []).some((g) => g.postId === numId))
        return "joined";

    return "none";
};

// Home.jsx 등에서 사용
export const fetchRecommendedStudies = async () => {
    const result = await fetchAllStudies({ limit: 3 });
    return result.data;
};

export const fetchStudyPreview = async () => {
    const result = await fetchAllStudies({ limit: 5 });
    return result.data;
};

export const fetchPendingStudies = fetchAppliedStudies;