import { UNIT, PCB_TO_KEYCAP, PCB_TO_KEYCAP_1_2 } from "./constants";

type KeySize = 1.00 | 1.25 | 1.50 | 1.75;
type Row = [number, (KeySize | null)[]];
type Layout = Row[];

type Position = [number, number, number];
type Positions = Position[];
type KeyPositions = Record<KeySize, Positions>;

export const layoutHelper = ({
  layout,
  offset = [0, 0, 0],
  thumbGap = 0,
  unit = UNIT,
  stag,
}: {
  layout: Layout,
  offset?: Position,
  thumbGap?: number,
  unit?: number,
  stag?: number[],
}) => {
  const res: KeyPositions = {
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

export const positionHelper = ({ offset, positions }: {
  offset: Position,
  positions: [number, number][]
}): Positions => (
  positions.map((pos) => [pos[0] + offset[0], offset[1], pos[1] + offset[2]])
);

export const backlitPositionsFromLayout = (
  layout: Partial<KeyPositions>,
): Positions => (
  Object.values(layout).reduce((l, r) => (
    l.concat(r.map((pos) => [pos[0], pos[1] - PCB_TO_KEYCAP + 0.8, pos[2] + 4.5]))
  ), [])
);

export const backlitPositionsFromLayout1_2 = (
  layout: Partial<KeyPositions>,
): Positions => (
  Object.values(layout).reduce((l, r) => (
    l.concat(r.map((pos) => [pos[0], pos[1] - PCB_TO_KEYCAP_1_2 + 0.8, pos[2] + 4.5]))
  ), [])
);
