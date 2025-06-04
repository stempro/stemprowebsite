
// frontend/src/hooks/useConfirm.ts
import { useState, useCallback } from 'react';

interface UseConfirmReturn {
  isOpen: boolean;
  confirm: () => Promise<boolean>;
  onOpen: () => void;
  onClose: () => void;
}

export function useConfirm(): UseConfirmReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = useCallback(() => {
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const onOpen = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
    setIsOpen(false);
  }, [resolvePromise]);

  const onClose = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
    setIsOpen(false);
  }, [resolvePromise]);

  return { isOpen, confirm, onOpen, onClose };
}
