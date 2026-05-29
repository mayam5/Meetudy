import { Button } from "react-bootstrap";
import { useState } from "react";
import "./InterestSection.css";
import StudyListItem from "./StudyListItem";

const FIELDS = ["개발", "디자인", "언어", "자격증", "취업"];

function InterestSection({ allStudies = [] }) {
    const [selectedField, setSelectedField] = useState(null);

    const filteredStudies = selectedField
        ? allStudies.filter((s) => s.field === selectedField)
        : [];

    return (
        <section className="interest-section">
            <h3>어떤 스터디를 찾고있나요?</h3>
            <h6>관심있는 분야를 선택해보세요!</h6>

            <div className="interest-buttons">
                {FIELDS.map((field) => (
                    <Button
                        key={field}
                        variant={selectedField === field ? "dark" : "light"}
                        onClick={() =>
                            setSelectedField(selectedField === field ? null : field)
                        }
                    >
                        {field}
                    </Button>
                ))}
            </div>

            <div className={`interest-list ${selectedField ? "open" : ""}`}>
                {filteredStudies.map((study) => (
                    <StudyListItem key={study.title} {...study} />
                ))}
            </div>
        </section>
    );
}

export default InterestSection;