import { useState, useEffect, useRef } from "react";
import "./Dropbox.css";

function Dropbox({ placeholder = "선택", options = [], value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropboxRef = useRef(null);

    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropboxRef.current && !dropboxRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="dropbox" ref={dropboxRef}>
            <button
                type="button"
                className={`dropbox-button ${value ? "selected" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? selectedOption.label : placeholder}
                <span className={`dropbox-arrow ${isOpen ? "open" : ""}`}>⌄</span>
            </button>

            {isOpen && (
                <div className="dropbox-list">
                    <ul className="dropbox-scroll-area">
                        {options.map((option) => (
                            <li
                                key={option.value}
                                className={`dropbox-item ${option.value === value ? "active" : ""}`}
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