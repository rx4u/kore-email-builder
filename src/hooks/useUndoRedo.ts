import { useCallback, useReducer } from 'react';

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
      return {
        past: [...state.past, state.present].slice(-50),
        present: action.payload,
        future: [],
      };
    case 'UNDO':
      if (state.past.length === 0) return state;
      return {
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: [state.present, ...state.future],
      };
    case 'REDO':
      if (state.future.length === 0) return state;
      return {
        past: [...state.past, state.present],
        present: state.future[0],
        future: state.future.slice(1),
      };
    default:
      return state;
  }
}

export function useUndoRedo<T>(initial: T) {
  const [state, dispatch] = useReducer(undoReducer<T>, {
    past: [],
    present: initial,
    future: [],
  });

  const set = useCallback((val: T) => dispatch({ type: 'SET', payload: val }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

  return {
    value: state.present,
    set,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
