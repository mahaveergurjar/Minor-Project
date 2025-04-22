import { toast } from 'react-toastify';

export const HandleSuccess = (msg: string) => {
  toast.success(msg, {
    position: 'top-right',
  });
};

export const HandleError = (msg: unknown) => {
    const message = typeof msg === 'string' ? msg : 'An unexpected error occurred';
    toast.error(message, {
      position: 'top-right',
    });
  };