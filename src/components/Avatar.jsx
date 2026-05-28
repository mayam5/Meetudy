function Avatar({ name, size = "sm" }) {
    return (
        <div className={`avatar ${size === "lg" ? "host" : ""}`}>
            {name}
        </div>
    );
}

export default Avatar;