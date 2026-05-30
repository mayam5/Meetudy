import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080";

function ApplicantPopup({ studyId, onClose }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const loadApplicants = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE}/posts/${studyId}/applications`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message);
        }

        setApplicants(result.data || []);
      } catch (e) {
        console.error(e);
        setError("신청자 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadApplicants();
  }, [studyId]);

  const handleAccept = async (applicationId) => {
    setProcessingId(applicationId);

    try {
      const res = await fetch(
        `${API_BASE}/applications/${applicationId}/accept`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        alert(result.message || "수락 실패");
        return;
      }

      setApplicants((prev) =>
        prev.filter((a) => a.applicationId !== applicationId)
      );
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (applicationId) => {
    setProcessingId(applicationId);

    try {
      const res = await fetch(
        `${API_BASE}/applications/${applicationId}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        alert(result.message || "거절 실패");
        return;
      }

      setApplicants((prev) =>
        prev.filter((a) => a.applicationId !== applicationId)
      );
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="app-popup-overlay" onClick={onClose}>
      <div className="app-popup" onClick={(e) => e.stopPropagation()}>
        <h3>신청자 관리</h3>

        {loading && <p>불러오는 중...</p>}
        {error && <p>{error}</p>}

        {!loading &&
          !error &&
          applicants.map((a) => (
            <div key={a.applicationId}>
              <span>{a.applicantNickname}</span>

              <button
                disabled={processingId === a.applicationId}
                onClick={() => handleAccept(a.applicationId)}
              >
                수락
              </button>

              <button
                disabled={processingId === a.applicationId}
                onClick={() => handleReject(a.applicationId)}
              >
                거절
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ApplicantPopup;