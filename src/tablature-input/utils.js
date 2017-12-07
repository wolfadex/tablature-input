export const dataToText = (notes = [], data = [[]]) => {
  data.splice(0,0, notes.map((note) => `${note}|`));
  // TODO: Remove mysterious `undefined` in first column
  return data.reduce(
    (rows, column) => column.reduce(
      (r, cell, i) => [...r, `${rows[i]}${cell == null ? '-' : cell}`],
      [],
    ),
    new Array(data[0].length),
  ).join('\n');
};

export const textToData = (text) => {
  const rows = text.split('\n');
  const notes = new Array(rows.length);
  // TODO: Actually parse data
  return {
    notes,
    data: [notes],
  };
};
