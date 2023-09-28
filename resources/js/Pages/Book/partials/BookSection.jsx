import axios from "axios";
import { useEffect, useState } from "react";

const SectionList = ({ sections, editSection, nestingLevel = 0 }) => (
    <ul style={{ paddingLeft: `${nestingLevel * 10}px` }}>
        {sections.map((section) => (
            <li key={section.id}>
                <a href="#" onClick={() => editSection(section)}>
                    {section.title}
                </a>
                {section.all_descendants &&
                    section.all_descendants.length > 0 && (
                        <SectionList
                            sections={section.all_descendants}
                            editSection={editSection}
                            nestingLevel={nestingLevel + 1}
                        />
                    )}
            </li>
        ))}
    </ul>
);

function BookSections({ bookId, editSection }) {
    const [sections, setSections] = useState([]);

    useEffect(() => {
        getSections();
    }, []);

    const getSections = async () => {
        const response = await axios.get(`/api/books/${bookId}/sections`);
        setSections(response.data.sections);
    };

    return (
        <div>
            <SectionList sections={sections} editSection={editSection} />
        </div>
    );
}
export default BookSections;
