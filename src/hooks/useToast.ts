import { toast, ToastContainer, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface ToastOptions {
  position?: ToastPosition;
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  theme?: 'light' | 'dark';
}

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light'
};

export const useToast = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    return toast.success(message, { ...defaultOptions, ...options });
  };

  const showError = (message: string, options?: ToastOptions) => {
    return toast.error(message, { ...defaultOptions, ...options });
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    return toast.info(message, { ...defaultOptions, ...options });
  };

  const showWarning = (message: string, options?: ToastOptions) => {
    return toast.warning(message, { ...defaultOptions, ...options });
  };

  const showPromise = <T,>(
    promise: Promise<T>,
    {
      pending,
      success,
      error
    }: {
      pending: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      pending,
      success,
      error
    }, defaultOptions);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showPromise,
    ToastContainer
  };
};
