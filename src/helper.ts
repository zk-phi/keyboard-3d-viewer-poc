type KeySize = 1.00 | 1.25 | 1.50 | 1.75;

export const UNIT = 19.05;

export const keyLayoutHelper = ({ unit = UNIT, offset, layout, stag }: {
  offset: [number, number, number],
  layout: [number, KeySize[]][],
  unit?: number,
  stag?: number[],
}) => {
  const res: Record<KeySize, [number, number, number][]> = {
    [1.00]: [],
    [1.25]: [],
    [1.50]: [],
    [1.75]: [],
  };

  layout.forEach(([rowOffset, keys], y) => {
    let x = rowOffset;
    keys.forEach((size, i) => {
      res[size].push([
        unit * (x + size / 2) + offset[0],
        offset[1],
        unit * (y + 0.5 + (stag?.[i] ?? 0)) + offset[2],
      ]);
      x += size;
    });
  });

  return res;
}
