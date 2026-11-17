import React from 'react';
import { CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';
import { useStore } from '@/src/context/StoreContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)]"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start gap-3 rounded-xl border border-[#E5DCD0] bg-white p-3.5 shadow-lg text-[#302B27]"
        >
          {toast.tone === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-[#456B50] shrink-0 mt-0.5" />
          ) : toast.tone === 'error' ? (
            <AlertTriangle className="h-5 w-5 text-[#B9382C] shrink-0 mt-0.5" />
          ) : (
            <Info className="h-5 w-5 text-[#A45C3B] shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-snug">{toast.title}</p>
            {toast.description ? (
              <p className="text-xs text-[#6B625B] mt-0.5 truncate">
                {toast.description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Close notification"
            className="text-[#6B625B] hover:text-[#302B27] p-0.5 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
