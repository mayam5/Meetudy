import "./StudyCard.css";
import AvatarGroup from "./AvatarGroup";
import HostInfo from "./HostInfo";
import { useNavigate } from "react-router-dom";

function StudyCard({ id, title = "", host = "", field = "", users = [], currentMembers, maxMembers, status = "OPEN", onClick }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (id) {
            navigate(`/study/${id}`);
        }
    };

    return (
        <div className="study-card" onClick={handleClick}>
            <div className="study-top">
                <h5 className="study-title">{title}</h5>
                <AvatarGroup users={users} />
            </div>
            <div className="study-bottom">
                <HostInfo host={host} field={field} />
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                    {currentMembers !== undefined && maxMembers !== undefined && (
                        <span className="member-count">{currentMembers} / {maxMembers}</span>
                    )}
                    <span className={`status-badge ${status === "OPEN" ? "open" : "closed"}`}>
                        {status === "OPEN" ? "모집중" : "모집마감"}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default StudyCard;
