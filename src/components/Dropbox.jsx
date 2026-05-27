import { useState } from "react";
import "./Dropbox.css";

function Dropbox({ placeholder, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="dropbox">
      <button
        type="button"
        className={`dropbox-button ${value ? "selected" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <span className="dropbox-arrow">⌄</span>
      </button>

        {isOpen && (
        <div className="dropbox-list">
            <ul className="dropbox-scroll-area">
            {options.map((option) => (
                <li
                key={option.value}
                className="dropbox-item"
                onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                }}
                >
                {option.label}
                </li>
            ))}
            </ul>
        </div>
        )}
    </div>
  );
}

export default Dropbox;