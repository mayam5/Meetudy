import { createContext, useContext, useState } from "react";

const BASE_URL = "http://localhost:8080";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => localStorage.getItem("isLoggedIn") === "true"
    );

    const login = (email) => {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (token) {
                await fetch(`${BASE_URL}/auth/logout`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
        } catch (e) {
            console.error("로그아웃 요청 실패:", e);
        } finally {
            setIsLoggedIn(false);
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userId");
            localStorage.removeItem("nickname");
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
