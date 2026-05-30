import { useEffect, useRef, useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

// ====================================================
// [백엔드 연결] API 경로
// - POST /api/auth/login
//     body: { email, password }
//     res:  { success, data: { accessToken }, message }
//
// - POST /api/auth/register
//     body: { email, password, nickname, categoryIds, region }
//     res:  { success, message }
//
// - POST /api/auth/find-email
//     body: { nickname }
//     res:  { success, data: { email }, message }
//
// - POST /api/auth/reset-password
//     body: { email, newPassword }
//     res:  { success, message }
//
// - GET  /api/categories
//     res: { data: [{ categoryId, categoryName }, ...] }
//
// - GET  /api/regions/cities
//     res: string[]
// ====================================================
const API_BASE = "/api";

function Login({ onClose, onLoginSuccess }) {
    const [mode, setMode] = useState("login");
    const [subMode, setSubMode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [regionOptions, setRegionOptions] = useState([]);

    // 이메일 찾기 state
    const [findNickname, setFindNickname] = useState("");
    const [foundEmail, setFoundEmail] = useState(null);
    const [findLoading, setFindLoading] = useState(false);
    const [findError, setFindError] = useState(null);

    // 비밀번호 재설정 state
    const [resetEmail, setResetEmail] = useState("");
    const [resetNewPassword, setResetNewPassword] = useState("");
    const [resetConfirmPassword, setResetConfirmPassword] = useState("");
    const [resetDone, setResetDone] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState(null);

    const loginFormRef = useRef(null);
    const signupFormRef = useRef(null);
    const { login } = useAuth();

    const handleClose = () => {
        if (typeof onClose === "function") onClose();
    };

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setSubMode(null);
        setFoundEmail(null); setFindNickname(""); setFindError(null);
        setResetEmail(""); setResetNewPassword(""); setResetConfirmPassword("");
        setResetDone(false); setResetError(null);
    };

    const handleSubModeChange = (newSubMode) => {
        setSubMode(newSubMode);
        setFoundEmail(null); setFindNickname(""); setFindError(null);
        setResetEmail(""); setResetNewPassword(""); setResetConfirmPassword("");
        setResetDone(false); setResetError(null);
    };

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === "Escape") handleClose(); };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    useEffect(() => {
        // [백엔드 연결] 카테고리 목록 조회
        fetch(`${API_BASE}/categories`)
            .then((res) => res.json())
            .then((result) => setCategoryOptions(result.data || []))
            .catch((e) => console.error("카테고리 불러오기 실패:", e));

        // [백엔드 연결] 지역 목록 조회
        fetch(`${API_BASE}/regions/cities`)
            .then((res) => res.json())
            .then((result) => setRegionOptions(result || []))
            .catch((e) => console.error("지역 불러오기 실패:", e));
    }, []);

    // [백엔드 연결] 로그인 / 회원가입
    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            if (mode === "login") {
                const res = await fetch(`${API_BASE}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: values.email, password: values.password }),
                });
                const result = await res.json();
                if (!result.success) { triggerShake(); alert(result.message || "로그인에 실패했습니다."); return; }
                localStorage.setItem("accessToken", result.data.accessToken);
                localStorage.setItem("userEmail", values.email);
                login(values.email);
                if (typeof onLoginSuccess === "function") onLoginSuccess();
                handleClose();
            } else {
                const res = await fetch(`${API_BASE}/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: values.email,
                        password: values.password,
                        nickname: values.username,
                        categoryIds: values.category,
                        region: values.region,
                    }),
                });
                const result = await res.json();
                if (!result.success) { triggerShake(); alert(result.message || "회원가입에 실패했습니다."); return; }
                alert("회원가입이 완료되었습니다.");
                handleModeChange("login");
            }
        } catch (e) {
            console.error(e);
            triggerShake();
            alert("서버 연결에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // [백엔드 연결] 이메일 찾기
    const handleFindEmail = async () => {
        if (!findNickname.trim()) { setFindError("닉네임을 입력해주세요."); return; }
        setFindLoading(true); setFindError(null); setFoundEmail(null);
        try {
            const res = await fetch(`${API_BASE}/auth/find-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nickname: findNickname }),
            });
            const result = await res.json();
            if (!result.success) { setFindError(result.message || "이메일을 찾을 수 없습니다."); return; }
            setFoundEmail(result.data?.email);
        } catch (e) {
            setFindError("서버 연결에 실패했습니다.");
        } finally {
            setFindLoading(false);
        }
    };

    // [백엔드 연결] 비밀번호 재설정
    // body: { email, newPassword } → 이메일 인증 없이 직접 변경
    const handleResetPassword = async () => {
        if (!resetEmail.trim()) { setResetError("이메일을 입력해주세요."); return; }
        if (!resetNewPassword.trim()) { setResetError("새 비밀번호를 입력해주세요."); return; }
        if (resetNewPassword.length < 6) { setResetError("비밀번호는 6자 이상이어야 합니다."); return; }
        if (resetNewPassword !== resetConfirmPassword) { setResetError("비밀번호가 일치하지 않습니다."); return; }
        setResetLoading(true); setResetError(null);
        try {
            const res = await fetch(`${API_BASE}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: resetEmail, newPassword: resetNewPassword }),
            });
            const result = await res.json();
            if (!result.success) { setResetError(result.message || "비밀번호 변경에 실패했습니다."); return; }
            setResetDone(true);
        } catch (e) {
            setResetError("서버 연결에 실패했습니다.");
        } finally {
            setResetLoading(false);
        }
    };

    const loginSchema = yup.object().shape({
        email: yup.string().email("이메일 형식이 아닙니다").required("이메일을 입력해주세요"),
        password: yup.string().required("비밀번호를 입력해주세요"),
    });

    const signupSchema = yup.object().shape({
        username: yup.string().required("닉네임을 입력해주세요"),
        email: yup.string().email("이메일 형식이 아닙니다").required("이메일을 입력해주세요")
            .test("email-not-username", "이메일과 닉네임은 같을 수 없습니다", function (value) {
                return value?.split("@")[0] !== this.parent.username;
            }),
        password: yup.string().min(6, "비밀번호는 6자 이상이어야 합니다").required("비밀번호를 입력해주세요"),
        confirmPassword: yup.string().oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다").required("비밀번호를 한번 더 입력해주세요"),
        category: yup.array().min(1, "카테고리를 하나 이상 선택해주세요"),
        region: yup.string().required("지역을 선택해주세요"),
    });

    const renderTitle = () => {
        if (subMode === "findEmail") return "이메일 찾기";
        if (subMode === "resetPassword") return "비밀번호 재설정";
        return mode === "login" ? "로그인" : "회원가입";
    };

    const handleSubmitClick = () => {
        if (mode === "login") loginFormRef.current?.requestSubmit();
        else signupFormRef.current?.requestSubmit();
    };

    return (
        <Modal show onHide={handleClose} centered dialogClassName="login-modal">
            <div className={shake ? "shake" : ""}>

                <Modal.Header closeButton>
                    <Modal.Title>{renderTitle()}</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    {/* 로그인 */}
                    {!subMode && mode === "login" && (
                        <div className="mode-content">
                            <Formik initialValues={{ email: "", password: "" }} validationSchema={loginSchema} onSubmit={handleFormSubmit}>
                                {({ handleSubmit, handleChange, values, touched, errors }) => (
                                    <Form noValidate onSubmit={handleSubmit} ref={loginFormRef}>
                                        <Form.Group className="mb-3">
                                            <div className="field-label">이메일</div>
                                            <Form.Control name="email" type="email" placeholder="example@email.com"
                                                value={values.email} onChange={handleChange}
                                                isInvalid={touched.email && !!errors.email} />
                                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <div className="field-label">비밀번호</div>
                                            <Form.Control name="password" type="password" placeholder="비밀번호를 입력하세요"
                                                value={values.password} onChange={handleChange}
                                                isInvalid={touched.password && !!errors.password} />
                                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    )}

                    {/* 회원가입 */}
                    {!subMode && mode === "signup" && (
                        <div className="mode-content">
                            <Formik
                                initialValues={{ username: "", email: "", password: "", confirmPassword: "", category: [], region: "" }}
                                validationSchema={signupSchema}
                                onSubmit={handleFormSubmit}
                            >
                                {({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => (
                                    <Form noValidate onSubmit={handleSubmit} ref={signupFormRef}>
                                        <div className="signup-flex">
                                            <div className="signup-left">
                                                <Form.Group className="mb-3">
                                                    <div className="field-label">닉네임</div>
                                                    <Form.Control name="username" placeholder="사용할 닉네임"
                                                        value={values.username} onChange={handleChange}
                                                        isInvalid={touched.username && !!errors.username} />
                                                    <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <div className="field-label">이메일</div>
                                                    <Form.Control name="email" type="email" placeholder="example@email.com"
                                                        value={values.email} onChange={handleChange}
                                                        isInvalid={touched.email && !!errors.email} />
                                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <div className="field-label">비밀번호</div>
                                                    <Form.Control name="password" type="password" placeholder="6자 이상"
                                                        value={values.password} onChange={handleChange}
                                                        isInvalid={touched.password && !!errors.password} />
                                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <div className="field-label">비밀번호 확인</div>
                                                    <Form.Control name="confirmPassword" type="password" placeholder="비밀번호 재입력"
                                                        value={values.confirmPassword} onChange={handleChange}
                                                        isInvalid={touched.confirmPassword && !!errors.confirmPassword} />
                                                    <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>

                                            <div className="signup-right">
                                                <Form.Group className="mb-3">
                                                    <div className="field-label">관심 분야</div>
                                                    <div className="category-wrap">
                                                        {categoryOptions.map((item) => (
                                                            <Form.Check
                                                                key={item.categoryId}
                                                                type="checkbox"
                                                                id={`cat-${item.categoryId}`}
                                                                className="category-check"
                                                                label={item.categoryName}
                                                                checked={values.category.includes(item.categoryId)}
                                                                onChange={() => {
                                                                    const exists = values.category.includes(item.categoryId);
                                                                    setFieldValue("category", exists
                                                                        ? values.category.filter((v) => v !== item.categoryId)
                                                                        : [...values.category, item.categoryId]);
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                    {touched.category && errors.category && (
                                                        <div className="field-error">{errors.category}</div>
                                                    )}
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <div className="field-label">선호 지역</div>
                                                    <div className="region-wrap">
                                                        {regionOptions.map((r) => (
                                                            <button key={r} type="button"
                                                                className={`region-btn ${values.region === r ? "active" : ""}`}
                                                                onClick={() => setFieldValue("region", values.region === r ? "" : r)}>
                                                                {r}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {touched.region && errors.region && (
                                                        <div className="field-error">{errors.region}</div>
                                                    )}
                                                </Form.Group>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    )}

                    {/* 이메일 찾기 */}
                    {subMode === "findEmail" && (
                        <div className="mode-content submode-wrap">
                            <p className="submode-desc">가입 시 사용한 닉네임으로 이메일을 찾아드려요.</p>
                            {!foundEmail ? (
                                <>
                                    <div className="field-label">닉네임</div>
                                    <Form.Control placeholder="닉네임 입력" className="mb-2"
                                        value={findNickname}
                                        onChange={(e) => { setFindNickname(e.target.value); setFindError(null); }}
                                        onKeyDown={(e) => e.key === "Enter" && handleFindEmail()}
                                    />
                                    {findError && <div className="field-error mb-2">{findError}</div>}
                                    <div className="text-end mt-2">
                                        <Button variant="primary" size="sm" onClick={handleFindEmail} disabled={findLoading}>
                                            {findLoading ? <Spinner size="sm" animation="border" /> : "이메일 찾기"}
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="result-box">
                                    <div className="result-label">찾은 이메일</div>
                                    <div className="result-value">{foundEmail}</div>
                                    <button className="result-action" onClick={() => handleSubModeChange(null)}>로그인하러 가기 →</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 비밀번호 재설정 */}
                    {subMode === "resetPassword" && (
                        <div className="mode-content submode-wrap">
                            {!resetDone ? (
                                <>
                                    <p className="submode-desc">가입한 이메일과 새 비밀번호를 입력해주세요.</p>
                                    <div className="field-label">이메일</div>
                                    <Form.Control type="email" placeholder="가입한 이메일" className="mb-3"
                                        value={resetEmail}
                                        onChange={(e) => { setResetEmail(e.target.value); setResetError(null); }}
                                    />
                                    <div className="field-label">새 비밀번호</div>
                                    <Form.Control type="password" placeholder="6자 이상" className="mb-3"
                                        value={resetNewPassword}
                                        onChange={(e) => { setResetNewPassword(e.target.value); setResetError(null); }}
                                    />
                                    <div className="field-label">비밀번호 확인</div>
                                    <Form.Control type="password" placeholder="비밀번호 재입력" className="mb-2"
                                        value={resetConfirmPassword}
                                        onChange={(e) => { setResetConfirmPassword(e.target.value); setResetError(null); }}
                                        onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                                    />
                                    {resetError && <div className="field-error mb-2">{resetError}</div>}
                                    <div className="text-end mt-2">
                                        <Button variant="primary" size="sm" onClick={handleResetPassword} disabled={resetLoading}>
                                            {resetLoading ? <Spinner size="sm" animation="border" /> : "비밀번호 변경"}
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="result-box">
                                    <div className="result-icon">✅</div>
                                    <div className="result-label">비밀번호 변경 완료</div>
                                    <div className="result-desc">비밀번호가 성공적으로 변경되었습니다.</div>
                                    <button className="result-action" onClick={() => handleSubModeChange(null)}>로그인하러 가기 →</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 모드 전환 */}
                    {!subMode && (
                        <div className="auth-switch-text text-center mt-3">
                            {mode === "login" ? (
                                <>계정이 없나요?<span className="auth-switch-link" onClick={() => handleModeChange("signup")}>회원가입</span></>
                            ) : (
                                <>이미 계정이 있나요?<span className="auth-switch-link" onClick={() => handleModeChange("login")}>로그인</span></>
                            )}
                        </div>
                    )}

                </Modal.Body>

                <Modal.Footer className="d-flex justify-content-between">
                    {!subMode ? (
                        <div>
                            <div className="auth-sub-link" onClick={() => handleSubModeChange("findEmail")}>이메일 찾기</div>
                            <div className="auth-sub-link" onClick={() => handleSubModeChange("resetPassword")}>비밀번호 재설정</div>
                        </div>
                    ) : (
                        <button className="back-link" onClick={() => handleSubModeChange(null)}>← 돌아가기</button>
                    )}
                    {!subMode && (
                        <Button variant="primary" disabled={loading} onClick={handleSubmitClick}>
                            {loading ? <><Spinner size="sm" animation="border" /> 처리 중...</> : mode === "login" ? "로그인" : "가입하기"}
                        </Button>
                    )}
                </Modal.Footer>

            </div>
        </Modal>
    );
}

export default Login;