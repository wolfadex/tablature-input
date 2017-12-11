export const ACTIONS = {
  FOCUS_COLUMN_RIGHT: 'FOCUS_COLUMN_RIGHT',
  FOCUS_COLUMN_LEFT: 'FOCUS_COLUMN_LEFT',
  FOCUS_ROW_DOWN: 'FOCUS_ROW_DOWN',
  FOCUS_ROW_UP: 'FOCUS_ROW_UP',
  FOCUS_EXACT: 'FOCUS_EXACT',
  SET_CELL_VALUE: 'SET_CELL_VALUE',
  CLEAR_CELL_VALUE: 'CLEAR_CELL_VALUE',
  INSERT_COLUMN_RIGHT: 'INSERT_COLUMN_RIGHT',
  INSERT_COLUMN_LEFT: 'INSERT_COLUMN_LEFT',
  DELETE_COLUMN: 'DELETE_COLUMN',
  DUPLICATE_COLUMN: 'DUPLICATE_COLUMN',
  MOVE_COLUMN_RIGHT: 'MOVE_COLUMN_RIGHT',
  MOVE_COLUMN_LEFT: 'MOVE_COLUMN_LEFT',
  MOVE_ROW_UP: 'MOVE_ROW_UP',
  MOVE_ROW_DOWN: 'MOVE_ROW_DOWN',
  MAKE_COLUMN_BAR: 'MAKE_COLUMN_BAR',
  UNDO_STATE: 'UNDO_STATE',
  REDO_STATE: 'REDO_STATE',
  // TODO: Clear column/row?
};

const DEFAULT_KEY_TO_ACTIONS = {
  ArrowLeft: ACTIONS.FOCUS_COLUMN_LEFT,
  ArrowRight: ACTIONS.FOCUS_COLUMN_RIGHT,
  ArrowUp: ACTIONS.FOCUS_ROW_UP,
  ArrowDown: ACTIONS.FOCUS_ROW_DOWN,
  'alt-ArrowLeft': ACTIONS.MOVE_COLUMN_LEFT,
  'alt-ArrowRight': ACTIONS.MOVE_COLUMN_RIGHT,
  'alt-ArrowUp': ACTIONS.MOVE_ROW_UP,
  'alt-ArrowDown': ACTIONS.MOVE_ROW_DOWN,
  Backspace: ACTIONS.DELETE_COLUMN,
  Delete: ACTIONS.DELETE_COLUMN,
  'alt-68': ACTIONS.DUPLICATE_COLUMN, // alt + d
  69: ACTIONS.INSERT_COLUMN_RIGHT, // e
  81: ACTIONS.INSERT_COLUMN_LEFT, // q
  '-': ACTIONS.CLEAR_CELL_VALUE,
  32: ACTIONS.CLEAR_CELL_VALUE,
  '|': ACTIONS.MAKE_COLUMN_BAR,
};

const literalChars = [
  'num-0', 'num-1', 'num-2', 'num-3', 'num-4', 'num-5', 'num-6', 'num-7', 'num-8', 'num-9',
  'h', 'p', 'b', 'r', '\\', '/', 'v', 't', 'x',
  '~',
];

literalChars.forEach((char) => DEFAULT_KEY_TO_ACTIONS[char] = ACTIONS.SET_CELL_VALUE);

const DEFAULT_MOUSE_TO_ACTIONS = {
  0: ACTIONS.FOCUS_EXACT,
};

const isMac = () => navigator.platform.indexOf('Mac') > -1;

export const eventToAction = ({
  shiftKey,
  altKey,
  metaKey,
  ctrlKey,
  key,
  keyCode,
  button,
}) => {
  if (isMac()) {
    if (metaKey && key === 'z') {
      if (shiftKey) {
        return ACTIONS.REDO_STATE;
      }

      return ACTIONS.UNDO_STATE;
    }
  } else {
    if (ctrlKey && key === 'z') {
      return ACTIONS.UNDO_STATE;
    } else if (ctrlKey && key === 'y') {
      return ACTIONS.REDO_STATE;
    }
  }

  if (key != null || keyCode != null) {
    return DEFAULT_KEY_TO_ACTIONS[`${altKey ? 'alt-' : ''}${Number.isInteger(Number(key)) ? 'num-' : ''}${key}`] ||
      DEFAULT_KEY_TO_ACTIONS[`${altKey ? 'alt-' : ''}${keyCode}`];
  }

  if (button != null) {
    return DEFAULT_MOUSE_TO_ACTIONS[button];
  }
};
