export const dataToText = (notes = [], data = [[]]) => {
  const textData = data.slice(0);
  textData.splice(0,0, notes.map((note) => `${note}|`));
  // TODO: Remove mysterious `undefined` in first column
  return textData.reduce(
    (rows, column) => column.reduce(
      (r, cell, i) => [...r, `${rows[i]}${cell == null ? '-' : cell}`],
      [],
    ),
    new Array(textData[0].length),
  ).join('\n');
};

export const textToData = (text) => {
  const rows = text.split('\n');
  const notes = [];
  const data = [];

  rows.forEach((row, i) => {
    const [
      note,
      ...chars
    ] = row.split('|');
    const joinedChars = chars.join('|');

    notes.push(note);

    for (let c = 0; c < joinedChars.length; c++) {
      if (data[c] == null) {
        data.push([]);
      }

      if (row[c] === '-') {
        data[c].push(null);
      } else {
        data[c].push(row[c]);
      }
    }
  });

  return {
    notes,
    data,
  };
};
