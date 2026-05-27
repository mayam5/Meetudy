import "./ConfirmPopup.css";

function ConfirmPopup({ message, onClose }) {
  return (
    <div className="confirm-popup-overlay">
      <div className="confirm-popup">
        <p>{message}</p>
        <button onClick={onClose}>확인</button>
      </div>
    </div>
  );
}

export default ConfirmPopup;