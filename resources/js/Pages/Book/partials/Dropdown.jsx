import React, { useState, useRef, useEffect } from 'react';

function Dropdown({ items, onSelect }) {
    const [isOpen, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelect = (item) => {
        onSelect(item);
        setOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <button onClick={() => setOpen(!isOpen)}>Select an item</button>

            {isOpen && (
                <ul className="absolute left-0 mt-2 w-48 border rounded-md shadow-md bg-white">
                    {items.map((item, index) => (
                        <li key={index} className="cursor-pointer hover:bg-gray-200" onClick={() => handleSelect(item)}>
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Dropdown;