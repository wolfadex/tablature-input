import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { eventToAction, ACTIONS } from './keyboard-input';
import { dataToText } from './utils';
import './style.css';

const styles = {
  wrapper: {
    display: 'grid',
    gridGap: '0rem',
  },
  noteList: {
    gridColumnStart: '1',
    gridColumnEnd: 'span 1',
    gridRowEnd: 'span 1',
    border: '0',
  },
};

const initializeData = (c, r) => {
  const data = [];
  const row = [];

  for (let i = 0; i < r; i++) {
    row.push(null);
  }

  for (let i = 0; i < c; i++) {
    data.push([...row]);
  }

  return data;
};

const handleNextRowColumn = ({
  currentRow,
  currentColumn,
  moveNextRow,
  moveNextColumn,
  notes,
  data,
}) => {
  let nextColumn = currentColumn;
  let nextRow = currentRow;

  if (moveNextColumn) {
    nextColumn += 1;

    if (nextColumn >= data.length) {
      nextColumn = 0;
      nextRow += 1;
    }

    if (nextRow >= notes.length) {
      nextRow = 0;
    }
  } else if (moveNextRow) {
    nextRow += 1;

    if (nextRow >= notes.length) {
      nextRow = 0;
      nextColumn += 1;
    }

    if (nextColumn >= data.length) {
      nextColumn = 0;
    }
  }

  return {
    nextRow,
    nextColumn,
  };
};

class TablatureInput extends Component {
  static propTypes = {
    nextRowOnSetValue: PropTypes.bool,
    nextColumnOnSetValue: PropTypes.bool,
  }

  static defaultProps = {
    nextRowOnSetValue: false,
    nextColumnOnSetValue: true,
  }

  state = {
    data: initializeData(20, 5),
    focusRow: 0,
    focusColumn: 0,
    notes: ['A', 'B', 'C', 'D', 'F#'],
  }

  handleClick = (focusColumn, focusRow) => (e) => {
    const clickAction = eventToAction(e);

    if (clickAction === ACTIONS.FOCUS_EXACT) {
      this.setState({
        focusRow,
        focusColumn,
      });
    }
  }

  handleKeyDown = (e) => {
    e.persist();

    if (e.key === 'Enter') {
      console.log(dataToText(this.state.notes, this.state.data))
      return;
    }

    if (e.target.tagName === 'INPUT') {
      return;
    }

    const keyDownAction = eventToAction(e);

    switch(keyDownAction) {
      case ACTIONS.FOCUS_COLUMN_RIGHT:
        this.setState(({ focusColumn, data }) => ({
          focusColumn: focusColumn + 1 >= data.length ? 0 : focusColumn + 1,
        }));
        break;
      case ACTIONS.FOCUS_COLUMN_LEFT:
        this.setState(({ focusColumn, data }) => ({
          focusColumn: focusColumn - 1 < 0 ? data.length - 1 : focusColumn - 1,
        }));
        break;
      case ACTIONS.FOCUS_ROW_UP:
        this.setState(({ focusRow, notes }) => ({
          focusRow: focusRow - 1 < 0 ? notes.length - 1 : focusRow - 1,
        }));
        break;
      case ACTIONS.FOCUS_ROW_DOWN:
        this.setState(({ focusRow, notes }) => ({
          focusRow: focusRow + 1 >= notes.length ? 0 : focusRow + 1,
        }));
        break;
      case ACTIONS.SET_CELL_VALUE:
        this.setState(({ focusRow, focusColumn, data, notes }, { nextRowOnSetValue, nextColumnOnSetValue }) => {
          const {
            nextRow,
            nextColumn,
          } = handleNextRowColumn({
            currentRow: focusRow,
            currentColumn: focusColumn,
            moveNextRow: nextRowOnSetValue,
            moveNextColumn: nextColumnOnSetValue,
            notes,
            data,
          });

          data[focusColumn][focusRow] = e.key;

          return {
            data,
            focusColumn: nextColumn,
            focusRow: nextRow,
          };
        });
        break;
      case ACTIONS.CLEAR_CELL_VALUE:
        this.setState(({ focusRow, focusColumn, data, notes }, { nextRowOnSetValue, nextColumnOnSetValue }) => {
          const {
            nextRow,
            nextColumn,
          } = handleNextRowColumn({
            currentRow: focusRow,
            currentColumn: focusColumn,
            moveNextRow: nextRowOnSetValue,
            moveNextColumn: nextColumnOnSetValue,
            notes,
            data,
          });

          data[focusColumn][focusRow] = null;

          return {
            data,
            focusColumn: nextColumn,
            focusRow: nextRow,
          };
        });
        break;
      case ACTIONS.INSERT_COLUMN_RIGHT:
        this.setState(({ focusColumn, notes, data }) => {
          const column = [];

          for (let i = 0; i < notes.length; i++) {
            column.push(null);
          }

          data.splice(focusColumn + 1, 0, column);

          return {
            data,
          };
        });
        break;
      case ACTIONS.INSERT_COLUMN_LEFT:
        this.setState(({ focusColumn, notes, data }) => {
          const column = [];

          for (let i = 0; i < notes.length; i++) {
            column.push(null);
          }

          data.splice(focusColumn, 0, column);

          return {
            data,
            focusColumn: focusColumn + 1,
          };
        });
        break;
      case ACTIONS.DELETE_COLUMN:
        this.setState(({ focusColumn, notes, data }) => {
          if (data.length > 1) {
            data.splice(focusColumn, 1);

            return {
              data,
              focusColumn: focusColumn >= data.length ? focusColumn - 1 : focusColumn,
            };
          }
        });
        break;
      case ACTIONS.DUPLICATE_COLUMN:
        this.setState(({ focusColumn, data }) => {
          data.splice(focusColumn + 1, 0, data[focusColumn]);

          return {
            data,
            focusColumn: focusColumn + 1,
          };
        });
        break;
      case ACTIONS.MOVE_COLUMN_RIGHT:
        this.setState(({ focusColumn, data }) => {
          if (focusColumn < data.length - 1) {
            const toMove = [...data[focusColumn]];

            data.splice(focusColumn, 1);
            data.splice(focusColumn + 1, 0, toMove);

            return {
              data,
              focusColumn: focusColumn + 1,
            };
          }
        });
        break;
      case ACTIONS.MOVE_COLUMN_LEFT:
        this.setState(({ focusColumn, data }) => {
          if (focusColumn > 0) {
            const toMove = [...data[focusColumn]];

            data.splice(focusColumn, 1);
            data.splice(focusColumn - 1, 0, toMove);

            return {
              data,
              focusColumn: focusColumn - 1,
            };
          }
        });
        break;
      case ACTIONS.MAKE_COLUMN_BAR:
        this.setState(({ focusColumn, data}) => {
          const bar = data[focusColumn].map(() => '|');

          data.splice(focusColumn, 1, bar);

          return {
            data,
          };
        })
        break;
      case ACTIONS.NO_ACTION:
        break;
      default:
        console.warn(`Action ${keyDownAction} not implemented yet`);
    }
  }

  handleNoteChange = (rowIndex) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.persist();
    this.setState(({ notes }) => {
      notes.splice(rowIndex, 1, e.target.value);

      return {
        notes,
      };
    });
  }

  render() {
    const {
      className,
      style,
    } = this.props;
    const {
      data = [],
      notes = [],
      focusRow,
      focusColumn,
    } = this.state;

    return (
      <div
        className={`wrapper ${className}`}
        style={{
          ...style,
          ...styles.wrapper,
          //          Columns:  Key    Bar    Notes
          gridTemplateColumns: `1.1rem 1.1rem ${data.map(() => '1.1rem').join(' ')}`,
          gridTemplateRows: notes.map(() => '1.1rem').join(' '),
        }}
        tabIndex="0"
        onKeyDown={this.handleKeyDown}
      >
        {notes.map((note, rowNumber) =>
          <Fragment key={`note-name-${rowNumber}`}>
            <input
              style={{
                ...styles.noteList,
                gridRowStart: `${rowNumber + 1}`,
              }}
              value={note}
              onChange={this.handleNoteChange(rowNumber)}
            />
            <div
              style={{
                ...styles.cell,
                gridColumnStart: '2',
                gridColumnEnd: 'span 1',
                gridRowStart: `${rowNumber + 1}`,
                gridRowEnd: 'span 1',
              }}
            >
              |
            </div>
          </Fragment>
        )}
        {data.map((columnData, columnNumber) =>
          (columnData || []).map((cellData, rowNumber) => {
            const hasFocus = focusRow === rowNumber && focusColumn === columnNumber;
            const isEmpty = cellData == null;

            return (
              <div
                key={`note-${columnNumber}-${rowNumber}`}
                className="cell"
                style={{
                  ...styles.cell,
                  gridColumnStart: `${columnNumber + 3}`,
                  gridColumnEnd: 'span 1',
                  gridRowStart: `${rowNumber + 1}`,
                  gridRowEnd: 'span 1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={this.handleClick(columnNumber, rowNumber)}
              >
                <div
                  style={{
                    backgroundColor: hasFocus ? 'rgb(175, 217, 244)' : '#fff',
                    border: isEmpty ? '1px solid black' : '0',
                    flex: '1',
                    height: hasFocus || !isEmpty ? '1rem' : '0px',
                    margin: '0 0.1rem',
                    transition: '0.2s',
                  }}
                >
                  {!isEmpty && cellData}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  }
}

export default TablatureInput;
