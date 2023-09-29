import React, { useState, useRef, useEffect } from "react";

function Dropdown({ items, item, title, id, label, onSelect }) {
    const [isOpen, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelect = (item) => {
        console.log('handleSelect',item);
        onSelect(item);
        setOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <div className="relative inline-block w-64">
                <select
                    onChange={handleSelect}
                    value={item ?? null}
                    className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                    <option value={null}>{title}</option>
                    {items.map((item) => (
                        <option key={item[id]} value={item}>
                            {item[label]}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default Dropdown;
