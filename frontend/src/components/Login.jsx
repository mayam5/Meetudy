import { useEffect, useRef, useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import { loginApi, signupApi, findEmailApi, resetPasswordApi } from "../api/auth";
import "./Login.css";

const REGION_DATA = {
    "서울특별시": {
        "강남구": ["역삼동", "삼성동", "대치동", "논현동"],
        "서초구": ["서초동", "반포동", "잠원동"],
        "마포구": ["서교동", "합정동", "연남동", "상암동"],
        "송파구": ["잠실동", "신천동", "가락동"],
        "영등포구": ["여의도동", "당산동", "영등포동"],
    },
    "경기도": {
        "성남시": ["분당구", "중원구", "수정구"],
        "수원시": ["장안구", "권선구", "팔달구", "영통구"],
        "고양시": ["일산동구", "일산서구", "덕양구"],
        "용인시": ["수지구", "기흥구", "처인구"],
        "부천시": ["원미구", "소사구", "오정구"],
    },
    "인천광역시": {
        "남동구": ["구월동", "간석동", "논현동"],
        "부평구": ["부평동", "삼산동", "산곡동"],
        "연수구": ["송도동", "연수동", "옥련동"],
    },
    "부산광역시": {
        "해운대구": ["우동", "좌동", "중동"],
        "부산진구": ["부전동", "전포동", "양정동"],
        "남구": ["대연동", "용호동", "문현동"],
    },
    "대구광역시": {
        "수성구": ["범어동", "황금동", "만촌동"],
        "달서구": ["월성동", "상인동", "이곡동"],
    },
    "대전광역시": {
        "서구": ["둔산동", "월평동", "관저동"],
        "유성구": ["봉명동", "궁동", "노은동"],
    },
    "광주광역시": {
        "북구": ["운암동", "용봉동", "문흥동"],
        "서구": ["치평동", "상무지구", "금호동"],
    },
};

const BASE_URL = "http://localhost:8080";

function Login({ onClose, onLoginSuccess }) {
    const [mode, setMode] = useState("login");
    const [subMode, setSubMode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);

    const [findNickname, setFindNickname] = useState("");
    const [foundEmail, setFoundEmail] = useState(null);
    const [findLoading, setFindLoading] = useState(false);
    const [findError, setFindError] = useState(null);

    const [resetEmail, setResetEmail] = useState("");
    const [resetNewPassword, setResetNewPassword] = useState("");
    const [resetConfirmPassword, setResetConfirmPassword] = useState("");
    const [resetDone, setResetDone] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState(null);

    const loginFormRef = useRef(null);
    const signupFormRef = useRef(null);
    const { login } = useAuth();

    const handleClose = () => { if (typeof onClose === "function") onClose(); };

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
        fetch(`${BASE_URL}/categories`)
            .then((res) => res.json())
            .then((result) => setCategoryOptions(result.data || []))
            .catch((e) => console.error("카테고리 불러오기 실패:", e));
    }, []);

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            if (mode === "login") {
                const result = await loginApi({ email: values.email, password: values.password });
                localStorage.setItem("accessToken", result.data.accessToken);
                localStorage.setItem("refreshToken", result.data.refreshToken);
                localStorage.setItem("userId", result.data.userId);
                localStorage.setItem("nickname", result.data.nickname);
                localStorage.setItem("userEmail", values.email);
                login(values.email);
                if (typeof onLoginSuccess === "function") onLoginSuccess();
                handleClose();
            } else {
                await signupApi({
                    email:         values.email,
                    password:      values.password,
                    nickname:      values.username,
                    birth:         values.birth         || null,
                    gender:        values.gender        || null,
                    agePublic:     values.agePublic,
                    bio:           values.bio           || null,
                    categoryIds:   values.category,
                    regionSido:    values.regionSido    || null,
                    regionSigungu: values.regionSigungu || null,
                    regionDong:    values.regionDong    || null,
                });
                alert("회원가입이 완료되었습니다.");
                handleModeChange("login");
            }
        } catch (e) {
            triggerShake();
            alert(e.message || "서버 연결에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleFindEmail = async () => {
        if (!findNickname.trim()) { setFindError("닉네임을 입력해주세요."); return; }
        setFindLoading(true); setFindError(null); setFoundEmail(null);
        try {
            const result = await findEmailApi({ nickname: findNickname });
            setFoundEmail(result.data?.email);
        } catch (e) {
            setFindError(e.message || "서버 연결에 실패했습니다.");
        } finally {
            setFindLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!resetEmail.trim()) { setResetError("이메일을 입력해주세요."); return; }
        if (!resetNewPassword.trim()) { setResetError("새 비밀번호를 입력해주세요."); return; }
        if (resetNewPassword.length < 8) { setResetError("비밀번호는 8자 이상이어야 합니다."); return; }
        if (resetNewPassword !== resetConfirmPassword) { setResetError("비밀번호가 일치하지 않습니다."); return; }
        setResetLoading(true); setResetError(null);
        try {
            await resetPasswordApi({ email: resetEmail, newPassword: resetNewPassword });
            setResetDone(true);
        } catch (e) {
            setResetError(e.message || "서버 연결에 실패했습니다.");
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
        password: yup.string().min(8, "비밀번호는 8자 이상이어야 합니다").required("비밀번호를 입력해주세요"),
        confirmPassword: yup.string().oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다").required("비밀번호를 한번 더 입력해주세요"),
        birth: yup.string(),
        gender: yup.string(),
        agePublic: yup.boolean(),
        bio: yup.string().max(100, "100자 이내로 입력해주세요"),
        category: yup.array(),
        regionSido: yup.string(),
        regionSigungu: yup.string(),
        regionDong: yup.string(),
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

    const contentClass = shake ? "shake" : "";
    const dialogClass = `login-modal${(mode === "login" || subMode) ? " is-login" : ""}`;

    return (
        <Modal
            show
            onHide={handleClose}
            centered
            dialogClassName={dialogClass}
            contentClassName={contentClass}
        >
            <Modal.Header closeButton>
                <Modal.Title>{renderTitle()}</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                {/* 로그인 */}
                {!subMode && mode === "login" && (
                    <div className="mode-content">
                        <Formik
                            initialValues={{ email: "", password: "" }}
                            validationSchema={loginSchema}
                            onSubmit={handleFormSubmit}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form noValidate onSubmit={handleSubmit} ref={loginFormRef}>
                                    <Form.Group className="mb-3">
                                        <div className="field-label">이메일</div>
                                        <Form.Control
                                            name="email" type="email" placeholder="example@email.com"
                                            value={values.email} onChange={handleChange}
                                            isInvalid={touched.email && !!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <div className="field-label">비밀번호</div>
                                        <Form.Control
                                            name="password" type="password" placeholder="비밀번호를 입력하세요"
                                            value={values.password} onChange={handleChange}
                                            isInvalid={touched.password && !!errors.password}
                                        />
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
                            initialValues={{
                                username: "", email: "", password: "", confirmPassword: "",
                                birth: "", gender: "", agePublic: false, bio: "",
                                category: [], regionSido: "", regionSigungu: "", regionDong: "",
                            }}
                            validationSchema={signupSchema}
                            onSubmit={handleFormSubmit}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => (
                                <Form noValidate onSubmit={handleSubmit} ref={signupFormRef}>
                                    <div className="signup-flex">

                                        {/* ── 1열: 필수 정보 ── */}
                                        <div className="signup-left">
                                            <div className="section-title">필수 정보</div>
                                            <Form.Group className="mb-3">
                                                <div className="field-label">닉네임</div>
                                                <Form.Control
                                                    name="username" placeholder="사용할 닉네임"
                                                    value={values.username} onChange={handleChange}
                                                    isInvalid={touched.username && !!errors.username}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <div className="field-label">이메일</div>
                                                <Form.Control
                                                    name="email" type="email" placeholder="example@email.com"
                                                    value={values.email} onChange={handleChange}
                                                    isInvalid={touched.email && !!errors.email}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <div className="field-label">비밀번호</div>
                                                <Form.Control
                                                    name="password" type="password" placeholder="8자 이상"
                                                    value={values.password} onChange={handleChange}
                                                    isInvalid={touched.password && !!errors.password}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <div className="field-label">비밀번호 확인</div>
                                                <Form.Control
                                                    name="confirmPassword" type="password" placeholder="비밀번호 재입력"
                                                    value={values.confirmPassword} onChange={handleChange}
                                                    isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="signup-divider" />

                                        {/* ── 2열: 선택 정보 (타이틀 + 두 영역 나란히) ── */}
                                        <div className="signup-right">
                                            <div className="section-title">
                                                선택 정보
                                                <span className="optional-badge">선택</span>
                                                <span className="section-title-sub">나중에 마이페이지에서도 설정할 수 있어요</span>
                                            </div>

                                            {/* 선택 내부 2열 */}
                                            <div className="optional-flex">

                                                {/* 개인 정보 */}
                                                <div className="optional-col">
                                                    <div className="d-flex gap-3 mb-3 align-items-end">
                                                        <Form.Group style={{ flex: 1 }}>
                                                            <div className="field-label">생년월일</div>
                                                            <Form.Control
                                                                name="birth" type="date"
                                                                value={values.birth} onChange={handleChange}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group className="pb-1">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="agePublic"
                                                                name="agePublic"
                                                                label="나이 공개"
                                                                checked={values.agePublic}
                                                                onChange={handleChange}
                                                            />
                                                        </Form.Group>
                                                    </div>
                                                    <Form.Group className="mb-3">
                                                        <div className="field-label">성별</div>
                                                        <Form.Select name="gender" value={values.gender} onChange={handleChange}>
                                                            <option value="">선택 안 함</option>
                                                            <option value="F">여성</option>
                                                            <option value="M">남성</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <div className="field-label">한줄 소개</div>
                                                        <Form.Control
                                                            as="textarea" name="bio" rows={2}
                                                            placeholder="자신을 간단히 소개해주세요 (100자 이내)"
                                                            value={values.bio} onChange={handleChange}
                                                            isInvalid={touched.bio && !!errors.bio}
                                                        />
                                                        <Form.Control.Feedback type="invalid">{errors.bio}</Form.Control.Feedback>
                                                    </Form.Group>
                                                </div>

                                                <div className="optional-divider" />

                                                {/* 관심 설정 */}
                                                <div className="optional-col">
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
                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <div className="field-label">선호 지역</div>
                                                        <Form.Select
                                                            name="regionSido" className="mb-2"
                                                            value={values.regionSido}
                                                            onChange={(e) => {
                                                                setFieldValue("regionSido", e.target.value);
                                                                setFieldValue("regionSigungu", "");
                                                                setFieldValue("regionDong", "");
                                                            }}
                                                        >
                                                            <option value="">시/도 선택</option>
                                                            {Object.keys(REGION_DATA).map((s) => (
                                                                <option key={s} value={s}>{s}</option>
                                                            ))}
                                                        </Form.Select>
                                                        <Form.Select
                                                            name="regionSigungu" className="mb-2"
                                                            value={values.regionSigungu}
                                                            onChange={(e) => {
                                                                setFieldValue("regionSigungu", e.target.value);
                                                                setFieldValue("regionDong", "");
                                                            }}
                                                            disabled={!values.regionSido}
                                                        >
                                                            <option value="">시/군/구 선택</option>
                                                            {values.regionSido &&
                                                                Object.keys(REGION_DATA[values.regionSido]).map((g) => (
                                                                    <option key={g} value={g}>{g}</option>
                                                                ))}
                                                        </Form.Select>
                                                        <Form.Select
                                                            name="regionDong"
                                                            value={values.regionDong}
                                                            onChange={handleChange}
                                                            disabled={!values.regionSigungu}
                                                        >
                                                            <option value="">읍/면/동 선택</option>
                                                            {values.regionSido && values.regionSigungu &&
                                                                REGION_DATA[values.regionSido][values.regionSigungu].map((d) => (
                                                                    <option key={d} value={d}>{d}</option>
                                                                ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </div>

                                            </div>{/* /optional-flex */}
                                        </div>{/* /signup-right */}

                                    </div>{/* /signup-flex */}
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
                                <Form.Control
                                    placeholder="닉네임 입력" className="mb-2"
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
                                <Form.Control
                                    type="email" placeholder="가입한 이메일" className="mb-3"
                                    value={resetEmail}
                                    onChange={(e) => { setResetEmail(e.target.value); setResetError(null); }}
                                />
                                <div className="field-label">새 비밀번호</div>
                                <Form.Control
                                    type="password" placeholder="8자 이상" className="mb-3"
                                    value={resetNewPassword}
                                    onChange={(e) => { setResetNewPassword(e.target.value); setResetError(null); }}
                                />
                                <div className="field-label">비밀번호 확인</div>
                                <Form.Control
                                    type="password" placeholder="비밀번호 재입력" className="mb-2"
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
                        {loading
                            ? <><Spinner size="sm" animation="border" /> 처리 중...</>
                            : mode === "login" ? "로그인" : "가입하기"
                        }
                    </Button>
                )}
            </Modal.Footer>

        </Modal>
    );
}

export default Login;