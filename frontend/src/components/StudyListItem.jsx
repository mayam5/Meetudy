import "./StudyListItem.css";
import AvatarGroup from "./AvatarGroup";
import HostInfo from "./HostInfo";
import { useNavigate } from "react-router-dom";

function StudyListItem({ id, title = "", host = "", field = "", users = [], currentMembers, maxMembers, status = "OPEN", onClick }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (id) {
            navigate(`/study/${id}`);
        }
    };

    return (
        <div className="study-item" onClick={handleClick}>
            <strong className="list-study-title">{title}</strong>
            <div className="host-box">
                <HostInfo host={host} field={field} />
            </div>
            <div className="item-right">
                <AvatarGroup users={users} />
                {currentMembers !== undefined && maxMembers !== undefined && (
                    <span className="member-count">{currentMembers} / {maxMembers}</span>
                )}
                <span className={`status-badge ${status === "OPEN" ? "open" : "closed"}`}>
                    {status === "OPEN" ? "모집중" : "모집마감"}
                </span>
            </div>
        </div>
    );
}

export default StudyListItem;