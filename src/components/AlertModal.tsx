'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'info';

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: AlertType;
}

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info'
}: AlertModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Icon and colors based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12" style={{ color: '#28a745' }} />;
      case 'error':
        return <AlertCircle className="w-12 h-12" style={{ color: 'var(--color-primary)' }} />;
      case 'info':
      default:
        return <Info className="w-12 h-12" style={{ color: 'var(--color-primary)' }} />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case 'success':
        return 'Erfolgreich';
      case 'error':
        return 'Fehler';
      case 'info':
      default:
        return 'Information';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.3s ease-in-out' }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-lg shadow-2xl max-w-md w-full pointer-events-auto"
          style={{
            animation: 'slideUp 0.3s ease-out',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-center gap-4">
              {getIcon()}
              <h2
                className="text-xl font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {getTitle()}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Schließen"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            <p
              className="text-base leading-relaxed whitespace-pre-line"
              style={{ color: 'var(--color-text-dark)' }}
            >
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-light)'
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
