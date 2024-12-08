import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, MouseEventHandler, ReactElement } from "react";

type DropDownTypes = {
    dropItems: {
        label: string,
        onClick: MouseEventHandler,
    }[],
    text: ReactElement | string | number,
    styles: string
}

export function DropDown({ dropItems, text, styles }: DropDownTypes) {
    const [isOpen, setIsOpen] = useState(false);
    const dropRef = useRef<HTMLSpanElement>(null);
    const dropMenuRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (dropRef.current && dropMenuRef.current) {
            const rect = dropRef.current.getBoundingClientRect();
            dropMenuRef.current.style.position = "absolute";
            dropMenuRef.current.style.top = `${rect.height}px`;
            dropMenuRef.current.style.width = `auto`;
        }
    }, []);

    return (
        <span className={`relative inline-flex z-0 items-center gap-1 `}>
            {/* Dropdown Trigger */}
            <span ref={dropRef} className={`inline-flex items-center ${styles}`}>
                <p className="flex">{text}</p>
                <motion.button
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "linear" }}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                >
                    <ChevronDown />
                </motion.button>
            </span>

            {/* Dropdown Menu */}
            <motion.div
                ref={dropMenuRef}
                animate={{ height: isOpen ? "auto" : 0 }}
                className="dropdown top-0 overflow-hidden bg-teal-500 dark:bg-gray-500"
                initial={false}
            >
                {
                    dropItems.map((item, i) => (
                        <span
                            key={i}
                            onClick={item.onClick}
                            className="block m-1 px-2 py-1 rounded-md cursor-pointer hover:dark:bg-gray-800 hover:bg-teal-800 text-nowrap"
                        >{item.label}
                        </span>
                    ))
                }
            </motion.div>
        </span>
    );
};