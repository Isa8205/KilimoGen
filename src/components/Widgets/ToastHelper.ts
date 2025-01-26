import { ToastOptions, toast } from "react-toastify";

const notify = (passed: boolean, message: string) => {
    console.log(passed, message)
    const properties: ToastOptions<unknown> = {
      position: "top-right", // Autocomplete works here
      autoClose: 3000, // Type-checked as a number
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined, // Can be used for manual progress updates
    }
    passed ? toast.success(message, properties) : toast.error(message, properties)
  };

export default notify;