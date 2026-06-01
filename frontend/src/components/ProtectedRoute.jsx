import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const { isLoggedIn } = useAuth();
    const location = useLocation();

    if (!isLoggedIn) {
        // 로그인 후 원래 페이지로 돌아오기 위해 현재 경로 저장
        return <Navigate to="/" state={{ from: location, needLogin: true }} replace />;
    }

    return children;
}

export default ProtectedRoute;