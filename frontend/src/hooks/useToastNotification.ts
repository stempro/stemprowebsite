// frontend/src/hooks/useToastNotification.ts
import { useToast } from '@chakra-ui/react';

interface ToastOptions {
  title: string;
  description?: string;
}

export function useToastNotification() {
  const toast = useToast();

  const showSuccess = ({ title, description }: ToastOptions) => {
    toast({
      title,
      description,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const showError = ({ title, description }: ToastOptions) => {
    toast({
      title,
      description,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  const showWarning = ({ title, description }: ToastOptions) => {
    toast({
      title,
      description,
      status: 'warning',
      duration: 4000,
      isClosable: true,
    });
  };

  const showInfo = ({ title, description }: ToastOptions) => {
    toast({
      title,
      description,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return { showSuccess, showError, showWarning, showInfo };
}