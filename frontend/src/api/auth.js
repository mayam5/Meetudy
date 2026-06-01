const BASE_URL = "http://localhost:8080";

const handleResponse = async (res) => {
    const result = await res.json();
    if (!result.success) throw new Error(result.message || "요청에 실패했습니다.");
    return result;
};

// 로그인
export const loginApi = async ({ email, password }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
};

// 회원가입
// payload: { email, password, nickname, birth, gender, agePublic, bio, categoryIds, regionSido, regionSigungu, regionDong }
export const signupApi = async (payload) => {
    const region = [payload.regionSido, payload.regionSigungu, payload.regionDong]
        .filter(Boolean)
        .join(" ");

    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email:       payload.email,
            password:    payload.password,
            nickname:    payload.nickname,
            birth:       payload.birth,
            gender:      payload.gender,
            agePublic:   payload.agePublic,
            bio:         payload.bio,
            categoryIds: payload.categoryIds,
            region,
        }),
    });
    return handleResponse(res);
};

// 로그아웃
export const logoutApi = async () => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
};

// 이메일 찾기
export const findEmailApi = async ({ nickname }) => {
    const res = await fetch(`${BASE_URL}/auth/find-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
    });
    return handleResponse(res);
};

// 비밀번호 재설정
export const resetPasswordApi = async ({ email, newPassword }) => {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
    });
    return handleResponse(res);
};