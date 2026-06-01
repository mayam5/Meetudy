import "./Avatar.css";

function Avatar({ name = "", isHost = false }) {
    return (
        <div className={`avatar ${isHost ? "host" : ""}`}>
            {name?.[0] ?? "?"}
        </div>
    );
}

export default Avatar;