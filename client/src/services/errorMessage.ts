import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

function isFetchBaseQueryError(e: unknown): e is FetchBaseQueryError {
  return typeof e === 'object' && e !== null && 'status' in e;
}

export function serializeRequestError(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
    return err.message;
  }
  if (isFetchBaseQueryError(err) && err.data && typeof err.data === 'object') {
    const d = err.data as Record<string, unknown>;
    if (typeof d.message === 'string') return d.message;
  }
  return 'Сталася помилка. Спробуйте ще раз.';
}
