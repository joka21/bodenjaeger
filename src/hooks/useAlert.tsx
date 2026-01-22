'use client';

import { useState, useCallback } from 'react';
import type { AlertType } from '@/components/AlertModal';

interface AlertState {
  isOpen: boolean;
  title?: string;
  message: string;
  type: AlertType;
}

export function useAlert() {
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  const showAlert = useCallback((
    message: string,
    type: AlertType = 'info',
    title?: string
  ) => {
    setAlertState({
      isOpen: true,
      message,
      type,
      title
    });
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showAlert(message, 'success', title);
  }, [showAlert]);

  const showError = useCallback((message: string, title?: string) => {
    showAlert(message, 'error', title);
  }, [showAlert]);

  const showInfo = useCallback((message: string, title?: string) => {
    showAlert(message, 'info', title);
  }, [showAlert]);

  const closeAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    alertState,
    showAlert,
    showSuccess,
    showError,
    showInfo,
    closeAlert
  };
}
