import "./StudyListItem.css";
import AvatarGroup from "./AvatarGroup";
import HostInfo from "./HostInfo";
import { useNavigate } from "react-router-dom";

function StudyListItem({ id, title = "", host = "", field = "", users = [], currentMembers, maxMembers, onClick }) {
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
            </div>
        </div>
    );
}

export default StudyListItem;
