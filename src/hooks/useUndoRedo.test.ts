import { describe, it, expect } from 'vitest';

interface UndoState<T> {
  past: T[];
  present: T;
  future: T[];
}

type UndoAction<T> =
  | { type: 'SET'; payload: T }
  | { type: 'UNDO' }
  | { type: 'REDO' };

function undoReducer<T>(state: UndoState<T>, action: UndoAction<T>): UndoState<T> {
  switch (action.type) {
    case 'SET':
      if (state.present === action.payload) return state;
      return { past: [...state.past, state.present].slice(-50), present: action.payload, future: [] };
    case 'UNDO':
      if (state.past.length === 0) return state;
      return { past: state.past.slice(0, -1), present: state.past[state.past.length - 1], future: [state.present, ...state.future] };
    case 'REDO':
      if (state.future.length === 0) return state;
      return { past: [...state.past, state.present], present: state.future[0], future: state.future.slice(1) };
    default:
      return state;
  }
}

const initial = <T>(v: T): UndoState<T> => ({ past: [], present: v, future: [] });

describe('undoReducer', () => {
  it('starts with initial value', () => {
    const state = initial('a');
    expect(state.present).toBe('a');
    expect(state.past).toHaveLength(0);
  });

  it('SET updates present and pushes to past', () => {
    const s = undoReducer(initial('a'), { type: 'SET', payload: 'b' });
    expect(s.present).toBe('b');
    expect(s.past).toEqual(['a']);
    expect(s.future).toEqual([]);
  });

  it('SET with same value is a no-op', () => {
    const s0 = initial('a');
    const s1 = undoReducer(s0, { type: 'SET', payload: 'a' });
    expect(s1).toBe(s0);
  });

  it('UNDO restores previous value', () => {
    let s = initial('a');
    s = undoReducer(s, { type: 'SET', payload: 'b' });
    s = undoReducer(s, { type: 'UNDO' });
    expect(s.present).toBe('a');
    expect(s.future).toEqual(['b']);
  });

  it('REDO re-applies undone change', () => {
    let s = initial('a');
    s = undoReducer(s, { type: 'SET', payload: 'b' });
    s = undoReducer(s, { type: 'UNDO' });
    s = undoReducer(s, { type: 'REDO' });
    expect(s.present).toBe('b');
    expect(s.future).toEqual([]);
  });

  it('UNDO on empty past is a no-op', () => {
    const s0 = initial('a');
    const s1 = undoReducer(s0, { type: 'UNDO' });
    expect(s1).toBe(s0);
  });

  it('REDO on empty future is a no-op', () => {
    const s0 = initial('a');
    const s1 = undoReducer(s0, { type: 'REDO' });
    expect(s1).toBe(s0);
  });

  it('SET clears future (branching)', () => {
    let s = initial('a');
    s = undoReducer(s, { type: 'SET', payload: 'b' });
    s = undoReducer(s, { type: 'UNDO' });
    s = undoReducer(s, { type: 'SET', payload: 'c' });
    expect(s.present).toBe('c');
    expect(s.future).toEqual([]);
  });

  it('history is capped at 50 steps', () => {
    let s = initial(0);
    for (let i = 1; i <= 55; i++) {
      s = undoReducer(s, { type: 'SET', payload: i });
    }
    expect(s.past.length).toBeLessThanOrEqual(50);
  });
});
