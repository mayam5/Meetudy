// 백엔드 연동 시 아래 함수들의 return 부분을 axios/fetch로 교체하세요

// 로그인
export const loginApi = async ({ email, password }) => {
    // TODO: return await axios.post("/api/auth/login", { email, password });
    return { success: true, email };
};

// 회원가입
export const signupApi = async (payload) => {
    // TODO: return await axios.post("/api/auth/signup", payload);
    console.log("signupApi payload:", payload);
    return { success: true };
};

// 로그아웃
export const logoutApi = async () => {
    // TODO: return await axios.post("/api/auth/logout");
    return { success: true };
};

// 이메일 찾기
export const findEmailApi = async ({ username }) => {
    // TODO: return await axios.post("/api/auth/find-email", { username });
    return { success: true, email: "test@example.com" };
};

// 비밀번호 재설정 링크 전송
export const resetPasswordApi = async ({ email }) => {
    // TODO: return await axios.post("/api/auth/reset-password", { email });
    return { success: true };
};