import "./StudyCard.css";
import AvatarGroup from "./AvatarGroup";
import HostInfo from "./HostInfo";
import { useNavigate } from "react-router-dom";

function StudyCard({ id, title = "", host = "", field = "", users = [], onClick }) {
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
            </div>
        </div>
    );
}

export default StudyCard;