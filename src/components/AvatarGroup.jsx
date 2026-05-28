import Avatar from "./Avatar";

function AvatarGroup({ users }) {
    return (
        <div className="avatar-group">

            {users.map((u, i) => (
                <Avatar key={i} name={u} />
            ))}

            <div className="more">
                +{users.length}
            </div>

        </div>
    );
}

export default AvatarGroup;