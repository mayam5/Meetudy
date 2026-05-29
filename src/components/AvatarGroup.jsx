import Avatar from "./Avatar";

function AvatarGroup({ users }) {
    return (
        <div className="avatar-group">

{users.map((u, i) => (
  <Avatar
    key={u.id || i}
    name={typeof u === "string" ? u : u.name}
  />
))}
            <div className="more">
                +{users.length}
            </div>

        </div>
    );
}

export default AvatarGroup;