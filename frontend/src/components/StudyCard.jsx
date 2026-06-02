import "./StudyCard.css";
import AvatarGroup from "./AvatarGroup";
import HostInfo from "./HostInfo";
import { useNavigate } from "react-router-dom";

function StudyCard({ id, title = "", host = "", field = "", users = [], currentMembers, maxMembers, onClick }) {
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
                {currentMembers !== undefined && maxMembers !== undefined && (
                    <span className="member-count">{currentMembers} / {maxMembers}</span>
                )}
            </div>
        </div>
    );
}

export default StudyCard;
