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
  NO_ACTION: 'NO_ACTION',
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
  '|': ACTIONS.MAKE_COLUMN_BAR,
  9: ACTIONS.NO_ACTION,
};

const literalChars = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'h', 'p', 'b', 'r', '\\', '/', 'v', 't', 'x',
  '~',
];

literalChars.forEach((char) => DEFAULT_KEY_TO_ACTIONS[char] = ACTIONS.SET_CELL_VALUE);

const DEFAULT_MOUSE_TO_ACTIONS = {
  0: ACTIONS.FOCUS_EXACT,
};

export const eventToAction = ({ shiftKey, altKey, key, keyCode, button }) => {
  console.log('key', key);
  if (key != null || keyCode != null) {
    return DEFAULT_KEY_TO_ACTIONS[`${altKey ? 'alt-' : ''}${key}`] ||
      DEFAULT_KEY_TO_ACTIONS[`${altKey ? 'alt-' : ''}${keyCode}`];
  }

  if (button != null) {
    return DEFAULT_MOUSE_TO_ACTIONS[button];
  }
};
