import { useEffect, useRef, useState } from "react";
import { Modal, Form, Button, Spinner, Dropdown, DropdownButton } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import { loginApi, signupApi } from "../api/auth";
import "./Login.css";

function Login({ onClose, onLoginSuccess }) {
    const [mode, setMode] = useState("login");
    const [subMode, setSubMode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const loginFormRef = useRef(null);
    const signupFormRef = useRef(null);
    const { login } = useAuth();

    const [categoryOptions, setCategoryOptions] = useState([]);

    const handleClose = () => {
        if (typeof onClose === "function") onClose();
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);


    useEffect(() => {
    fetch("http://localhost:8080/categories")
        .then((res) => res.json())
        .then((result) => {
        setCategoryOptions(result.data);
        })
        .catch((error) => {
        console.error("카테고리 불러오기 실패:", error);
        });
    }, []);

    // 💡 2. 로그인/회원가입 버튼 클릭 후 Formik의 유효성 검사를 통과하면 실행되는 최종 서밋 함수입니다.
const handleFormSubmit = async (values) => {
    setLoading(true);

    try {
        if (mode === "login") {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });

            const result = await response.json();

            if (!result.success) {
                setShake(true);
                setTimeout(() => setShake(false), 500);
                alert(result.message || "로그인에 실패했습니다.");
                return;
            }

            localStorage.setItem("accessToken", result.data.accessToken);
            localStorage.setItem("userEmail", values.email);

            if (typeof onLoginSuccess === "function") {
                onLoginSuccess();
            }

            handleClose();
        } else {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                    nickname: values.username,
                }),
            });

            const result = await response.json();

            if (!result.success) {
                setShake(true);
                setTimeout(() => setShake(false), 500);
                alert(result.message || "회원가입에 실패했습니다.");
                return;
            }

            alert("회원가입 되었습니다");
            setMode("login");
            setSubMode(null);
        }
    } catch (error) {
        console.error(error);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        alert("서버 연결 실패");
    } finally {
        setLoading(false);
    }
};

    const loginSchema = yup.object().shape({
        email: yup.string().email("이메일 형식이 아닙니다").required("필수 입력"),
        password: yup.string().required("필수 입력"),
    });

    const signupSchema = yup.object().shape({
        username: yup.string().required("닉네임은 필수입니다"),
        email: yup
            .string()
            .email("이메일 형식이 아닙니다")
            .required("필수 입력")
            .test("email-not-username", "이메일과 닉네임은 같을 수 없습니다", function (value) {
                const { username } = this.parent;
                return value?.split("@")[0] !== username;
            }),
        password: yup.string().min(6, "최소 6자").required("필수 입력"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다")
            .required("필수 입력"),
        category: yup.array().min(1, "카테고리를 하나 이상 선택해주세요"),
        region: yup.string().required("지역을 입력해주세요"),
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
        <Modal show onHide={handleClose} centered>
            <div className={shake ? "shake" : ""}>

                <Modal.Header closeButton>
                    <Modal.Title>{renderTitle()}</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    {/* LOGIN */}
                    {!subMode && mode === "login" && (
                        <Formik
                            initialValues={{ email: "", password: "" }}
                            validationSchema={loginSchema}
                            onSubmit={handleFormSubmit}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form noValidate onSubmit={handleSubmit} ref={loginFormRef}>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            value={values.email}
                                            onChange={handleChange}
                                            isInvalid={touched.email && !!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            name="password"
                                            type="password"
                                            placeholder="Password"
                                            value={values.password}
                                            onChange={handleChange}
                                            isInvalid={touched.password && !!errors.password}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                            )}
                        </Formik>
                    )}

                    {/* SIGNUP */}
                    {!subMode && mode === "signup" && (
                        <Formik
                            initialValues={{
                                username: "", email: "", password: "",
                                confirmPassword: "", category: [], region: "",
                            }}
                            validationSchema={signupSchema}
                            onSubmit={handleFormSubmit}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => (
                                <Form noValidate onSubmit={handleSubmit} ref={signupFormRef}>
                                    <div className="signup-flex">
                                        <div className="signup-left">
                                            <Form.Group className="mb-3">
                                                <div className="category-title">Nickname</div>
                                                <Form.Control
                                                    name="username" placeholder="닉네임"
                                                    value={values.username} onChange={handleChange}
                                                    isInvalid={touched.username && !!errors.username}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <div className="category-title">Email</div>
                                                <Form.Control
                                                    name="email" type="email" placeholder="Email"
                                                    value={values.email} onChange={handleChange}
                                                    isInvalid={touched.email && !!errors.email}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <div className="category-title">Password</div>
                                                <Form.Control
                                                    name="password" type="password" placeholder="비밀번호"
                                                    value={values.password} onChange={handleChange}
                                                    isInvalid={touched.password && !!errors.password}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <div className="category-title">Confirm Password</div>
                                                <Form.Control
                                                    name="confirmPassword" type="password" placeholder="비밀번호 확인"
                                                    value={values.confirmPassword} onChange={handleChange}
                                                    isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="signup-right">
                                            <Form.Group className="mb-3">
                                                <div className="category-title">카테고리</div>
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

    const newValue = exists
      ? values.category.filter((v) => v !== item.categoryId)
      : [...values.category, item.categoryId];

    setFieldValue("category", newValue);
  }}
/>
/*
                                                    {[
                                                        { key: "dev", label: "개발" },
                                                        { key: "design", label: "디자인" },
                                                        { key: "plan", label: "기획" },
                                                        { key: "language", label: "언어" },
                                                    ].map((item) => (
                                                        <Form.Check
                                                            key={item.key}
                                                            type="checkbox"
                                                            id={`cat-${item.key}`}
                                                            className="category-check"
                                                            label={item.label}
                                                            checked={values.category.includes(item.key)}
                                                            onChange={() => {
                                                                const exists = values.category.includes(item.key);
                                                                setFieldValue(
                                                                    "category",
                                                                    exists
                                                                        ? values.category.filter((v) => v !== item.key)
                                                                        : [...values.category, item.key]
                                                                );
                                                            }}
                                                        />
*/
                                                    ))}
                                                </div>
                                                {touched.category && errors.category && (
                                                    <div className="text-danger" style={{ fontSize: "12px" }}>
                                                        {errors.category}
                                                    </div>
                                                )}
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <div className="category-title">선호 지역</div>
                                                <DropdownButton
                                                    id="region-dropdown"
                                                    title={values.region || "지역 선택"}
                                                    onSelect={(value) => setFieldValue("region", value)}
                                                >
                                                    {["서울", "경기", "인천", "부산", "대구"].map((r) => (
                                                        <Dropdown.Item key={r} eventKey={r}>{r}</Dropdown.Item>
                                                    ))}
                                                </DropdownButton>
                                                {touched.region && errors.region && (
                                                    <div className="text-danger" style={{ fontSize: "12px" }}>
                                                        {errors.region}
                                                    </div>
                                                )}
                                            </Form.Group>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}

                    {/* SUBMODE */}
                    {subMode === "findEmail" && (
                        <div className="submode-wrap">
                            <p className="submode-desc">닉네임을 입력하면 이메일을 찾아드려요.</p>
                            <Form.Control placeholder="닉네임 입력" className="mb-3" />
                            <div className="text-end">
                                <Button variant="dark" size="sm" onClick={() => setSubMode(null)}>확인</Button>
                            </div>
                        </div>
                    )}

                    {subMode === "resetPassword" && (
                        <div className="submode-wrap">
                            <p className="submode-desc">가입한 이메일로 재설정 링크를 보내드려요.</p>
                            <Form.Control type="email" placeholder="이메일 입력" className="mb-3" />
                            <div className="text-end">
                                <Button variant="dark" size="sm" onClick={() => setSubMode(null)}>전송</Button>
                            </div>
                        </div>
                    )}

                    {/* SWITCH */}
                    {!subMode && (
                        <div className="auth-switch-text text-center mt-3">
                            {mode === "login" ? (
                                <>
                                    계정이 없나요?{" "}
                                    <span
                                        className="auth-switch-link"
                                        onClick={() => { setMode("signup"); setSubMode(null); }}
                                    >
                                        회원가입
                                    </span>
                                </>
                            ) : (
                                <>
                                    이미 계정이 있나요?{" "}
                                    <span
                                        className="auth-switch-link"
                                        onClick={() => { setMode("login"); setSubMode(null); }}
                                    >
                                        로그인
                                    </span>
                                </>
                            )}
                        </div>
                    )}

                </Modal.Body>

                <Modal.Footer className="d-flex justify-content-between">
                    {!subMode ? (
                        <div className="small text-muted">
                            <div className="auth-sub-link" onClick={() => setSubMode("findEmail")}>
                                Forgot Email?
                            </div>
                            <div className="auth-sub-link" onClick={() => setSubMode("resetPassword")}>
                                Forgot Password?
                            </div>
                        </div>
                    ) : (
                        <div />
                    )}

                    <Button
                        variant="primary"
                        disabled={loading}
                        onClick={handleSubmitClick}
                    >
                        {loading ? (
                            <><Spinner size="sm" animation="border" /> 처리 중...</>
                        ) : mode === "login" ? "로그인" : "회원가입"}
                    </Button>
                </Modal.Footer>

            </div>
        </Modal>
    );
}

export default Login;