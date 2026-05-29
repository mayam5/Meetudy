import { useNavigate } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="notfound-page">
            <div className="notfound-content">
                <h1 className="notfound-code">404</h1>
                <h2 className="notfound-title">페이지를 찾을 수 없어요</h2>
                <p className="notfound-desc">
                    주소가 잘못됐거나 삭제된 페이지예요.
                </p>
                <button className="notfound-btn" onClick={() => navigate("/")}>
                    홈으로 돌아가기
                </button>
            </div>
        </div>
    );
}

export default NotFound;