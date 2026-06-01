import "./HostInfo.css";
import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";

function HostInfo({ host = "", field = "", hostId = null }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (hostId) navigate(`/profile/${hostId}`);
    };

    return (
        <div
            className="host-box"
            onClick={handleClick}
            style={{ cursor: hostId ? "pointer" : "default" }}
        >
            <Avatar name={host} isHost />
            <div className="host-info">
                <span className="host-name">{host}</span>
                <span className="tag">#{field}</span>
            </div>
        </div>
    );
}

export default HostInfo;