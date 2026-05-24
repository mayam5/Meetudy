import "../pages/Home.css";
import "./StudyListItem.css";
import AvatarGroup from "./AvatarGroup";
import HostInfo from "./HostInfo";

function StudyListItem({ title, host, field, users }) {

    return (
        <div className="study-item">

            <strong className="list-study-title">
                {title}
            </strong>

            <HostInfo host={host} field={field} />

            <AvatarGroup users={users} />

        </div>
    );
}

export default StudyListItem;