import "./StudyListItem.css";
import AvatarGroup from "./AvatarGroup";
import HostInfo from "./HostInfo";
import { useNavigate } from "react-router-dom";

function StudyListItem({ id, title = "", host = "", field = "", users = [], onClick }) {
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
            <HostInfo host={host} field={field} />
            <AvatarGroup users={users} />
        </div>
    );
}

export default StudyListItem;