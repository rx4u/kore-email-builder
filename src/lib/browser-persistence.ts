/**
 * Browser state persistence for Kore Email Builder.
 * Saves session (email state, template, theme, UI prefs) to localStorage
 * so the user can resume after closing the tab or refreshing.
 *
 * @see src/docs/BMAD_PERSISTENCE_PROPOSAL.md
 */

const STORAGE_KEY = 'kore-email-builder-session';
export const PERSISTENCE_VERSION = 1;

/** Persisted session payload. Complex nested state is JSON-serializable. */
export interface PersistedSession {
  version: number;
  savedAt: string; // ISO string
  emailState: unknown;
  currentTemplate: string;
  globalTheme: unknown;
  mode: 'build' | 'preview' | 'code';
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
}

export function saveSession(payload: PersistedSession): boolean {
  try {
    const json = JSON.stringify(payload);
    localStorage.setItem(STORAGE_KEY, json);
    return true;
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('[persistence] save failed:', e);
    }
    return false;
  }
}

export function loadSession(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return null;
    const data = JSON.parse(raw) as PersistedSession;
    if (data == null || typeof data !== 'object' || data.version !== PERSISTENCE_VERSION) {
      return null;
    }
    if (
      typeof data.savedAt !== 'string' ||
      typeof data.currentTemplate !== 'string' ||
      typeof data.mode !== 'string' ||
      typeof data.leftPanelCollapsed !== 'boolean' ||
      typeof data.rightPanelCollapsed !== 'boolean'
    ) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
