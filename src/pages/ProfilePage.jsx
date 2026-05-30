import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { fetchUserById } from "../api/user";

function ProfilePage() {
    const { hostId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchUserById(hostId);
                if (!data) setError("사용자를 찾을 수 없습니다.");
                else setUser(data);
            } catch (e) {
                setError("데이터를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [hostId]);

    if (loading) return <div className="profile-page-status">불러오는 중...</div>;
    if (error) return <div className="profile-page-status error">{error}</div>;
    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="profile-page-container">

                <button className="profile-back-btn" onClick={() => navigate(-1)}>
                    ← 뒤로가기
                </button>

                <div className="profile-card">
                    <div className="profile-avatar">
                        {user.nickname?.[0] ?? "?"}
                    </div>
                    <h2 className="profile-nickname">{user.nickname}</h2>
                    <span className="profile-field">#{user.field}</span>
                    <div className="profile-divider" />
                    <p className="profile-bio">{user.bio ?? "소개가 없습니다."}</p>
                </div>

            </div>
        </div>
    );
}

export default ProfilePage;