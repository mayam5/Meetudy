import "./StudyCard.css";
import AvatarGroup from "./AvatarGroup";
import HostInfo from "./HostInfo";

function StudyCard({ title = "", host = "", field = "", users = [], onClick }) {
    return (
        <div className="study-card" onClick={onClick}>
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