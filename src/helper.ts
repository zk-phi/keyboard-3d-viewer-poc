type KeySize = 1.00 | 1.25 | 1.50 | 1.75;
type Row = [number, (KeySize | null)[]];
type Layout = Row[];

export const UNIT = 19.05;

export const keyLayoutHelper = ({
  layout,
  offset = [0, 0, 0],
  thumbGap = 0,
  unit = UNIT,
  stag,
}: {
  layout: Layout,
  offset?: [number, number, number],
  thumbGap?: number,
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
    const isThumb = y === layout.length - 1;
    let x = rowOffset;
    keys.forEach((size, i) => {
      if (!size) return;
      res[size].push([
        unit * (x + size / 2) + offset[0],
        offset[1],
        unit * (y + 0.5 + (stag?.[i] ?? 0) + (isThumb ? thumbGap : 0)) + offset[2],
      ]);
      x += size;
    });
  });

  return res;
};

export const screwLayoutHelper = ({ offset, positions }: {
  offset: [number, number, number],
  positions: [number, number][]
}): [number, number, number][] => (
  positions.map((pos) => [pos[0] + offset[0], offset[1], pos[1] + offset[2]])
);
