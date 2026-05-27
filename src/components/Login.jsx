import { useEffect, useState } from "react";
import { Modal, Form, Button, Spinner, Dropdown, DropdownButton } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import "./Login.css";

function Login({ onClose, onLoginSuccess }) {
    const [mode, setMode] = useState("login");
    const [subMode, setSubMode] = useState(null);

    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const handleClose = () => {
        if (typeof onClose === "function") onClose();
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") handleClose();
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    // 💡 2. 로그인/회원가입 버튼 클릭 후 Formik의 유효성 검사를 통과하면 실행되는 최종 서밋 함수입니다.
    const handleFormSubmit = (values) => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);

            if (mode === "login") {

                localStorage.setItem("userEmail", values.email);
                if (typeof onLoginSuccess === "function") {
                    onLoginSuccess();
                }
            } else {
                setMode("login"); // 가입 완료 후 로그인 폼으로 전환 등
            }
        }, 1000);
    };

    // ======================
    // VALIDATION
    // ======================
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
            .test(
                "email-not-username",
                "이메일과 닉네임은 같을 수 없습니다",
                function (value) {
                    const { username } = this.parent;
                    const emailId = value?.split("@")[0];
                    return emailId !== username;
                }
            ),

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

    return (
        <Modal show onHide={handleClose} centered>
            <div className={shake ? "shake" : ""}>

                <Modal.Header closeButton>
                    <Modal.Title>{renderTitle()}</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    {/* ================= LOGIN ================= */}
                    {!subMode && mode === "login" && (
                        <Formik
                            initialValues={{ email: "", password: "" }}
                            validationSchema={loginSchema}
                            onSubmit={handleFormSubmit}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form noValidate onSubmit={handleSubmit}>

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

                                    <button type="submit" hidden />
                                </Form>
                            )}
                        </Formik>
                    )}

                    {/* ================= SIGNUP ================= */}
                    {!subMode && mode === "signup" && (
                        <Formik
                            initialValues={{
                                username: "",
                                email: "",
                                password: "",
                                confirmPassword: "",
                                category: [],
                                region: "",
                            }}
                            validationSchema={signupSchema}
                            onSubmit={handleFormSubmit}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <div className="signup-flex">

                                        {/* ================= LEFT ================= */}
                                        <div className="signup-left">

                                            <Form.Group className="mb-3">
                                                <div className="category-title">Nickname</div>
                                                <Form.Control
                                                    name="username"
                                                    placeholder="닉네임"
                                                    value={values.username}
                                                    onChange={handleChange}
                                                    isInvalid={touched.username && !!errors.username}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.username}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <div className="category-title">Email</div>
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
                                                <div className="category-title">Password</div>
                                                <Form.Control
                                                    name="password"
                                                    type="password"
                                                    placeholder="비밀번호"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    isInvalid={touched.password && !!errors.password}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.password}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <div className="category-title">Confirm Password</div>
                                                <Form.Control
                                                    name="confirmPassword"
                                                    type="password"
                                                    placeholder="비밀번호 확인"
                                                    value={values.confirmPassword}
                                                    onChange={handleChange}
                                                    isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.confirmPassword}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                        </div>

                                        {/* ================= RIGHT ================= */}
                                        <div className="signup-right">

                                            <Form.Group className="mb-3">
                                                <div className="category-title">카테고리</div>

                                                <div className="category-wrap">
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

                                                                const newValue = exists
                                                                    ? values.category.filter((v) => v !== item.key)
                                                                    : [...values.category, item.key];

                                                                setFieldValue("category", newValue);
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <div className="category-title">선호 지역
                                                    <DropdownButton
                                                        id="region-dropdown"
                                                        title={values.region || "지역 선택"}
                                                        drop="down"
                                                        flip={false}
                                                        onSelect={(value) => setFieldValue("region", value)}
                                                    >
                                                        <Dropdown.Item eventKey="서울">서울</Dropdown.Item>
                                                        <Dropdown.Item eventKey="경기">경기</Dropdown.Item>
                                                        <Dropdown.Item eventKey="인천">인천</Dropdown.Item>
                                                        <Dropdown.Item eventKey="부산">부산</Dropdown.Item>
                                                        <Dropdown.Item eventKey="대구">대구</Dropdown.Item>
                                                    </DropdownButton>
                                                </div>
                                            </Form.Group>

                                        </div>

                                    </div>

                                    <button type="submit" hidden />
                                </Form>
                            )}
                        </Formik>
                    )}

                    {/* SWITCH */}
                    {!subMode && (
                        <div className="text-center mt-3">
                            {mode === "login" ? (
                                <>
                                    계정이 없나요?{" "}
                                    <span onClick={() => setMode("signup")} style={{ cursor: "pointer", color: "blue" }}>
                                        회원가입
                                    </span>
                                </>
                            ) : (
                                <>
                                    이미 계정이 있나요?{" "}
                                    <span onClick={() => setMode("login")} style={{ cursor: "pointer", color: "blue" }}>
                                        로그인
                                    </span>
                                </>
                            )}
                        </div>
                    )}

                </Modal.Body>

                {/* FOOTER */}
                <Modal.Footer className="d-flex justify-content-between">
                    <div className="small text-muted">
                        <div onClick={() => setSubMode("findEmail")} style={{ cursor: "pointer" }}>Forgot Email?</div>
                        <div onClick={() => setSubMode("resetPassword")} style={{ cursor: "pointer" }}>Forgot Password?</div>
                    </div>

                    <Button
                        variant="primary"
                        disabled={loading}
                        onClick={() => {
                            document.querySelector(".modal.show form")?.requestSubmit();
                        }}
                    >
                        {loading ? (
                            <>
                                <Spinner size="sm" animation="border" /> 로그인...
                            </>
                        ) : mode === "login" ? (
                            "로그인"
                        ) : (
                            "회원가입"
                        )}
                    </Button>
                </Modal.Footer>

            </div>
        </Modal>
    );
}

export default Login;