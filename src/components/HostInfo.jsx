import Avatar from "./Avatar";

function HostInfo({ host, field }) {
    return (
        <div className="host-box">

            <Avatar name={host[0]} size="lg" />

            <div className="host-info">

                <span className="host-name">
                    {host}
                </span>

                <span className="tag">
                    #{field}
                </span>

            </div>

        </div>
    );
}

export default HostInfo;