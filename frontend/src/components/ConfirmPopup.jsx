import "./ConfirmPopup.css";

function ConfirmPopup({ message = "확인하시겠습니까?", onConfirm, onClose }) {
    return (
        <div className="confirm-popup-overlay" onClick={onClose}>
            <div className="confirm-popup" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-popup-top-bar" />
                <div className="confirm-popup-inner">
                    <div className="confirm-popup-icon">⚠️</div>
                    <p>{message}</p>
                    <p className="confirm-popup-sub">이 작업은 되돌릴 수 없습니다.</p>
                    <div className="confirm-popup-buttons">
                        <button className="confirm-cancel" onClick={onClose}>취소</button>
                        <button className="confirm-ok" onClick={onConfirm}>확인</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmPopup;