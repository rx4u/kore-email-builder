/**
 * Unit tests for browser persistence (save/load/clear session).
 * Uses in-memory localStorage mock for Node/Vitest.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  saveSession,
  loadSession,
  clearSession,
  PERSISTENCE_VERSION,
  type PersistedSession,
} from './browser-persistence';

const STORAGE_KEY = 'kore-email-builder-session';

function createMockStorage(): Record<string, string> {
  const store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    get store() {
      return store;
    },
  };
}

describe('browser-persistence', () => {
  let mock: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    mock = createMockStorage();
    vi.stubGlobal('localStorage', mock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const validSession: PersistedSession = {
    version: PERSISTENCE_VERSION,
    savedAt: new Date().toISOString(),
    emailState: { header: {}, content: [], footer: {} },
    currentTemplate: 'release-notes',
    globalTheme: {},
    mode: 'build',
    leftPanelCollapsed: false,
    rightPanelCollapsed: false,
  };

  it('saveSession writes JSON to localStorage and returns true', () => {
    const ok = saveSession(validSession);
    expect(ok).toBe(true);
    expect(mock.getItem(STORAGE_KEY)).not.toBeNull();
    const parsed = JSON.parse(mock.getItem(STORAGE_KEY)!);
    expect(parsed.version).toBe(PERSISTENCE_VERSION);
    expect(parsed.currentTemplate).toBe('release-notes');
    expect(parsed.mode).toBe('build');
  });

  it('loadSession returns null when key is missing', () => {
    expect(loadSession()).toBeNull();
  });

  it('loadSession returns session when valid', () => {
    saveSession(validSession);
    const loaded = loadSession();
    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(validSession.version);
    expect(loaded!.currentTemplate).toBe(validSession.currentTemplate);
    expect(loaded!.emailState).toEqual(validSession.emailState);
  });

  it('loadSession returns null when version mismatch', () => {
    mock.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...validSession, version: 99 })
    );
    expect(loadSession()).toBeNull();
  });

  it('loadSession returns null when JSON is invalid', () => {
    mock.setItem(STORAGE_KEY, 'not json');
    expect(loadSession()).toBeNull();
  });

  it('loadSession returns null when required fields are missing', () => {
    mock.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: PERSISTENCE_VERSION,
        savedAt: validSession.savedAt,
        // missing currentTemplate, mode, booleans
      })
    );
    expect(loadSession()).toBeNull();
  });

  it('clearSession removes the key', () => {
    saveSession(validSession);
    expect(mock.getItem(STORAGE_KEY)).not.toBeNull();
    clearSession();
    expect(mock.getItem(STORAGE_KEY)).toBeNull();
  });

  it('clearSession does not throw when key is missing', () => {
    expect(() => clearSession()).not.toThrow();
  });
});
