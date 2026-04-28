import { ignoreError } from '../utils/ignoreError';

const STORAGE_KEY = 'formsLite:submitSuccess';

export function setSubmitSuccessFlash(message: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, message);
  } catch (err: unknown) {
    ignoreError(err);
  }
}

export function getSubmitSuccessFlash(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch (err: unknown) {
    ignoreError(err);
    return null;
  }
}

export function clearSubmitSuccessFlash(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (err: unknown) {
    ignoreError(err);
  }
}
