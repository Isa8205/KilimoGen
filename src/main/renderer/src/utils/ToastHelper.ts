import { ToastOptions, toast } from "react-toastify";

const properties: ToastOptions<unknown> = {
  position: "top-right", // Autocomplete works here
  autoClose: 3000, // Type-checked as a number
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined, // Can be used for manual progress updates
}
const notify = (passed: boolean, message: string) => {
    passed ? toast.success(message, properties) : toast.error(message, properties)

    toast.clearWaitingQueue()
  };

export default notify;
export {properties}