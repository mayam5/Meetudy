import "../pages/Home.css";

function StudyListItem({ title, host, field, users }) {

    return (
        <div className="study-item">

            {/* 왼쪽 영역 */}
            <div className="study-left">

                {/* 제목 */}
                <strong className="list-study-title">
                    {title}
                </strong>

                {/* 호스트 정보 */}
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

            {/* 오른쪽 참여자 */}
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
    );
}

export default StudyListItem;