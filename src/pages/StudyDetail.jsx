import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./StudyDetail.css";
import {
    fetchStudyById,
    applyToStudy,
    cancelApplication,
    deleteStudy,
    fetchMyStudyRelation,
    fetchJoinedStudies,
    leaveStudyGroup,
} from "../api/study";
import { toggleBookmark } from "../api/user";
import AvatarGroup from "../components/AvatarGroup";
import HostInfo from "../components/HostInfo";
import ConfirmPopup from "../components/ConfirmPopup";
import { useAuth } from "../context/AuthContext";
import { FiBookmark } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";

function StudyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const [study, setStudy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [relation, setRelation] = useState("none");
    const [actionLoading, setActionLoading] = useState(false);
    const [popup, setPopup] = useState({ open: false, message: "", onConfirm: null });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [data, rel] = await Promise.all([
                    fetchStudyById(id),
                    isLoggedIn ? fetchMyStudyRelation(id) : Promise.resolve("none"),
                ]);
                if (!data) {
                    setError("스터디를 찾을 수 없습니다.");
                } else {
                    setStudy(data);
                    setIsBookmarked(data.isBookmarked ?? false);
                }
                setRelation(rel);
            } catch (e) {
                setError("데이터를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, isLoggedIn]);

    const openPopup = (message, onConfirm) => setPopup({ open: true, message, onConfirm });
    const closePopup = () => setPopup({ open: false, message: "", onConfirm: null });

    const handleBookmark = async () => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }
        const prev = isBookmarked;
        setIsBookmarked(!prev);
        try {
            await toggleBookmark(id, prev);
        } catch (e) {
            console.error("북마크 실패:", e);
            setIsBookmarked(prev);
        }
    };

    const handleApply = async () => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            closePopup();
            return;
        }
        setActionLoading(true);
        try {
            await applyToStudy(id);
            setRelation("pending");
        } catch (e) {
            alert(e.message || "신청에 실패했습니다.");
        } finally {
            setActionLoading(false);
        }
        closePopup();
    };

    const handleCancel = async () => {
        setActionLoading(true);
        try {
            await cancelApplication(id);
            setRelation("none");
        } catch (e) {
            alert(e.message || "취소에 실패했습니다.");
        } finally {
            setActionLoading(false);
        }
        closePopup();
    };

    const handleLeave = async () => {
        setActionLoading(true);
        try {
            const result = await fetchJoinedStudies();
            const group = (result.data ?? []).find((s) => s.id === Number(id));
            if (!group?.groupId) throw new Error("참여 중인 모임을 찾을 수 없습니다.");
            await leaveStudyGroup(group.groupId);
            setRelation("none");
        } catch (e) {
            alert(e.message || "나가기에 실패했습니다.");
        } finally {
            setActionLoading(false);
        }
        closePopup();
    };

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await deleteStudy(id);
            navigate("/whole-list");
        } catch (e) {
            alert(e.message || "삭제에 실패했습니다.");
        } finally {
            setActionLoading(false);
        }
        closePopup();
    };

    const renderActions = () => {
        switch (relation) {
            case "none":
                return (
                    <button
                        className="detail-apply-btn"
                        disabled={actionLoading}
                        onClick={() => openPopup("이 스터디에 신청하시겠습니까?", handleApply)}
                    >
                        신청하기
                    </button>
                );
            case "pending":
                return (
                    <div className="detail-action-group">
                        <span className="detail-status-text pending">승인 대기 중</span>
                        <button
                            className="detail-cancel-btn"
                            disabled={actionLoading}
                            onClick={() => openPopup("신청을 취소하시겠습니까?", handleCancel)}
                        >
                            신청 취소
                        </button>
                    </div>
                );
            case "accepted":
                return (
                    <div className="detail-action-group">
                        <span className="detail-status-text accepted">참여 중</span>
                        <button
                            className="detail-chat-btn"
                            onClick={() => navigate("/chat")}
                        >
                            채팅방 이동
                        </button>
                        <button
                            className="detail-cancel-btn"
                            disabled={actionLoading}
                            onClick={() => openPopup("모임에서 나가시겠습니까?", handleLeave)}
                        >
                            나가기
                        </button>
                    </div>
                );
            case "rejected":
                return <span className="detail-status-text rejected">신청이 거절되었습니다</span>;
            case "owned":
                return (
                    <div className="detail-action-group">
                        <button
                            className="detail-edit-btn"
                            onClick={() => navigate(`/post-edit/${id}`)}
                        >
                            수정하기
                        </button>
                        <button
                            className="detail-delete-btn"
                            disabled={actionLoading}
                            onClick={() => openPopup("정말 삭제하시겠습니까?", handleDelete)}
                        >
                            삭제하기
                        </button>
                    </div>
                );
            case "joined":
                return (
                    <div className="detail-action-group">
                        <span className="detail-status-text accepted">참여 중</span>
                        <button
                            className="detail-chat-btn"
                            onClick={() => navigate("/chat")}
                        >
                            채팅방 이동
                        </button>
                        <button
                            className="detail-cancel-btn"
                            disabled={actionLoading}
                            onClick={() => openPopup("모임에서 나가시겠습니까?", handleLeave)}
                        >
                            나가기
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading) return <div className="study-detail-status">불러오는 중...</div>;
    if (error) return <div className="study-detail-status error">{error}</div>;
    if (!study) return null;

    return (
        <div className="study-detail-page">
            <div className="study-detail-container">

                <div className="study-detail-header">
                    <div className="study-detail-tags">
                        {(study.tags ?? []).map((tag) => (
                            <span key={tag} className="study-detail-tag">#{tag}</span>
                        ))}
                    </div>
                    <button
                        className={`study-detail-bookmark ${isBookmarked ? "bookmarked" : ""}`}
                        onClick={handleBookmark}
                    >
                        {isBookmarked ? <BsBookmarkFill /> : <FiBookmark />}
                    </button>
                </div>

                <h1 className="study-detail-title">{study.title}</h1>

                <div className="study-detail-host-row">
                    <HostInfo host={study.host} field={study.field} hostId={study.hostId} />
                    <AvatarGroup users={study.users ?? []} />
                </div>

                <div className="study-detail-section">
                    <h4>모임 설명</h4>
                    <p>{study.description ?? "설명이 없습니다."}</p>
                </div>

                <div className="study-detail-info-grid">
                    <div className="study-detail-info-item">
                        <span className="info-label">분야</span>
                        <span className="info-value">{study.field ?? "-"}</span>
                    </div>
                    <div className="study-detail-info-item">
                        <span className="info-label">최대 인원</span>
                        <span className="info-value">
                            {study.maxMembers ? `${study.maxMembers}명` : "-"}
                        </span>
                    </div>
                    <div className="study-detail-info-item">
                        <span className="info-label">현재 인원</span>
                        <span className="info-value">{study.currentMembers ?? 0}명</span>
                    </div>
                    <div className="study-detail-info-item">
                        <span className="info-label">모집 상태</span>
                        <span className={`info-value status ${study.status ?? "OPEN"}`}>
                            {study.status === "CLOSED" ? "모집 완료"
                                : study.status === "PAUSED" ? "모집 일시 중단"
                                    : "모집 중"}
                        </span>
                    </div>
                    <div className="study-detail-info-item">
                        <span className="info-label">모임 요일</span>
                        <span className="info-value">{study.dayOfWeek ?? "-"}</span>
                    </div>
                    <div className="study-detail-info-item">
                        <span className="info-label">모임 시간</span>
                        <span className="info-value">{study.timeSlotName ?? "-"}</span>
                    </div>
                    <div className="study-detail-info-item">
                        <span className="info-label">장소</span>
                        <span className="info-value">{study.place ?? "-"}</span>
                    </div>
                </div>

                <div className="study-detail-actions">
                    <button className="detail-back-btn" onClick={() => navigate(-1)}>
                        ← 뒤로가기
                    </button>
                    {renderActions()}
                </div>

            </div>

            {popup.open && (
                <ConfirmPopup
                    message={popup.message}
                    onConfirm={popup.onConfirm}
                    onClose={closePopup}
                />
            )}
        </div>
    );
}

export default StudyDetail;