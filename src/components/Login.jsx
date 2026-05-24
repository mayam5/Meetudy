import { useEffect, useState } from "react";
import "./Login.css";

function Login({ onClose }) {

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

    const handleSubmit = () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setShake(true);
            setTimeout(() => setShake(false), 400);
        }, 1000);
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div
                className={`modal-box ${shake ? "shake" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >

                {/* HEADER */}
                <div className="modal-header">
                    <h2>
                        {subMode === "findEmail" && "이메일 찾기"}
                        {subMode === "resetPassword" && "비밀번호 재설정"}
                        {!subMode && (mode === "login" ? "로그인" : "회원가입")}
                    </h2>

                    <button className="close-x" onClick={handleClose}>
                        ✕
                    </button>
                </div>

                {/* INPUT */}
                <div className="input-group">

                    {subMode === "findEmail" ? (
                        <>
                            <input placeholder="가입 시 이름" />
                            <input placeholder="전화번호" />
                        </>
                    ) : subMode === "resetPassword" ? (
                        <>
                            <input placeholder="Email" />
                            <input type="password" placeholder="새 비밀번호" />
                        </>
                    ) : (
                        <>
                            <input placeholder="Email" />
                            <input type="password" placeholder="Password" />

                            {mode === "signup" && (
                                <input placeholder="Username" />
                            )}
                        </>
                    )}

                </div>

                {/* SWITCH */}
                {!subMode && (
                    <div className="switch">
                        {mode === "login" ? (
                            <>
                                계정이 없나요?
                                <span onClick={() => setMode("signup")}>
                                    회원가입
                                </span>
                            </>
                        ) : (
                            <>
                                이미 계정이 있나요?
                                <span onClick={() => setMode("login")}>
                                    로그인
                                </span>
                            </>
                        )}
                    </div>
                )}

                {/* FOOTER */}
                <div className="footer">

                    <div className="footer-left">
                        {!subMode && (
                            <div className="forgot">
                                <span onClick={() => setSubMode("findEmail")}>
                                    Forgot Email?
                                </span>
                                <span onClick={() => setSubMode("resetPassword")}>
                                    Forgot Password?
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="footer-right">

                        {!subMode && (
                            <button
                                className="primary-btn"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading
                                    ? "처리중..."
                                    : mode === "login"
                                        ? "로그인"
                                        : "회원가입"}
                            </button>
                        )}

                        {subMode === "findEmail" && (
                            <button className="primary-btn" onClick={handleSubmit}>
                                이메일 찾기
                            </button>
                        )}

                        {subMode === "resetPassword" && (
                            <button className="primary-btn" onClick={handleSubmit}>
                                비밀번호 변경
                            </button>
                        )}
                    </div>

                </div>

                {/* BACK */}
                {subMode && (
                    <div className="back-area">
                        <span onClick={() => setSubMode(null)}>
                            ← Back
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Login;