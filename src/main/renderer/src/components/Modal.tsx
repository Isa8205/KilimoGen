import useClickOutside from "@/hooks/useClickOutside";
import { X } from "lucide-react";
import React, { ReactElement, useRef } from "react";

interface ModalProps {
    title: string;
    children: ReactElement;
    modalFunction: Function;
}
export default function Modal({title, children, modalFunction}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    useClickOutside(modalRef, () => modalFunction(false))

    return (
        <div className="fixed top-0 bottom-0 right-0 left-0 bg-black/40 backdrop-brightness-50 z-50 flex justify-center items-center">
            <div className="">
                {React.cloneElement(children)}

            </div>
        </div>
    )
}