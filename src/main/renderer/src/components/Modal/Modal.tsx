import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import { ToastContainer } from "react-toastify";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ title, isOpen, onClose, children }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Expose the ref properly
    useImperativeHandle(ref, () => modalRef.current as HTMLDivElement);

    if (!isOpen) return null;

    return (
      <div
        ref={modalRef}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <ToastContainer/>
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border-l-8 border-orange-500 space-y-6 relative">
          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-orange-400 pb-2">
            {title}
          </h2>
          {children}
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

export default Modal;
