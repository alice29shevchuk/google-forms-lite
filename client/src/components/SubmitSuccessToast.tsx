import { useEffect } from 'react';

const AUTO_DISMISS_MS = 4000;

type Props = {
  message: string | null;
  onDismiss: () => void;
};

export function SubmitSuccessToast({ message, onDismiss }: Props) {
  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(id);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="app-toast" role="status" aria-live="polite">
      <span className="app-toast-text">{message}</span>
      <button type="button" className="app-toast-close" onClick={onDismiss} aria-label="Закрити">
        ×
      </button>
    </div>
  );
}
