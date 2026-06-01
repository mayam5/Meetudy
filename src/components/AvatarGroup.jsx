import "./AvatarGroup.css";
import Avatar from "./Avatar";

const MAX_DISPLAY = 3;

function AvatarGroup({ users = [] }) {
    const visible = users.slice(0, MAX_DISPLAY);
    const extra = users.length - MAX_DISPLAY;

    return (
        <div className="avatar-group">
            {visible.map((u, i) => (
                <Avatar
                    key={u.id || i}
                    name={typeof u === "string" ? u : (u.name ?? u.nickname ?? "")}
                />
            ))}
            {extra > 0 && (
                <div className="more">+{extra}</div>
            )}
        </div>
    );
}

export default AvatarGroup;