import React, { ReactElement, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: Function;
  children: ReactElement;
}
const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const [format, setFormat] = useState("pdf");
  const [range, setRange] = useState("all");
  const [startNumber, setStartNumber] = useState(1);

  if (!isOpen) return null;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data = {
      format,
      range,
      startNumber: range === "from" ? startNumber : null,
    };
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border-l-8 border-orange-500 space-y-6 relative">
        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-orange-400 pb-2">
          Export Options
        </h2>
        {React.cloneElement(children)}
      </div>
    </div>
  );
};

export default Modal;
