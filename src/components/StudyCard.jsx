import "../pages/Home.css";

function StudyCard({ title, host, field, users }) {

    return (
        <div className="study-card">

            {/* 제목 + 참여자 */}
            <div className="study-top">

                <h5 className="study-title">
                    {title}
                </h5>

                <div className="avatar-group">

                    {users.map((u, i) => (
                        <div key={i} className="avatar">
                            {u}
                        </div>
                    ))}

                    <div className="more">
                        +{users.length}
                    </div>

                </div>

            </div>

            {/* 호스트 정보 */}
            <div className="study-bottom">

                <div className="host-box">

                    <div className="avatar host">
                        {host[0]}
                    </div>

                    <div className="host-info">

                        <span className="host-name">
                            {host}
                        </span>

                        <span className="tag">
                            #{field}
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default StudyCard;