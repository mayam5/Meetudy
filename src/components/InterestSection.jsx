import { Button } from "react-bootstrap";
import { useState } from "react";
import "./InterestSection.css";
import StudyListItem from "./StudyListItem";

function InterestSection({ allStudies }) {
    const [hoveredField, setHoveredField] = useState(null);

    const fields = ["개발", "디자인", "언어", "자격증", "취업"];

    const filteredStudies = hoveredField
        ? allStudies.filter((s) => s.field === hoveredField)
        : allStudies;

    return (
        <section
            className="interest-section"
            onMouseLeave={() => setHoveredField(null)}
        >
            <h3>어떤 스터디를 찾고있나요?</h3>
            <h6>관심있는 분야를 선택해보세요!</h6>

            <div className="interest-buttons">
                {fields.map((field) => (
                    <Button
                        key={field}
                        variant="light"
                        onMouseEnter={() => setHoveredField(field)}
                    >
                        {field}
                    </Button>
                ))}
            </div>

            <div className={`interest-list ${hoveredField ? "open" : ""}`}>
                {filteredStudies.map((study, i) => (
                    <StudyListItem key={i} {...study} />
                ))}
            </div>
        </section>
    );
}

export default InterestSection;