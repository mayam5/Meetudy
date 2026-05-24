import { useEffect, useState } from "react";
import "./Login.css";

function Login({ onClose }) {

    const [mode, setMode] = useState("login");
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    // ESC 닫기
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const handleLogin = () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);

            setShake(true);
            setTimeout(() => setShake(false), 400);
        }, 1000);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>

            <div
                className={`modal-box ${shake ? "shake" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >

                {/* title */}
                <div className="modal-header">
                    <h2>{mode === "login" ? "로그인" : "회원가입"}</h2>
                </div>

                {/* inputs */}
                <div className="input-group">

                    <input placeholder="Email" />

                    <input
                        type="password"
                        placeholder="Password"
                    />

                    {mode === "signup" && (
                        <input placeholder="Username" />
                    )}
                </div>

                {/* button */}
                <button
                    className="primary-btn"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "로그인 중..." : "로그인"}
                </button>

                {/* switch */}
                <div className="switch">
                    {mode === "login" ? (
                        <p>
                            계정이 없나요?
                            <span onClick={() => setMode("signup")}>
                                회원가입
                            </span>
                        </p>
                    ) : (
                        <p>
                            이미 계정이 있나요?
                            <span onClick={() => setMode("login")}>
                                로그인
                            </span>
                        </p>
                    )}
                </div>

                {/* close */}
                <button className="close-btn" onClick={onClose}>
                    닫기
                </button>

            </div>
        </div>
    );
}

export default Login;