import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, screwLayoutHelper } from "./helper";
import { CHOC_PLATE_FACE_TO_PCB_FACE, CHOC_PCB_FACE_TO_KEYCAP_BOTTOM } from "./constants";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const UNIT_V = 17;
const UNIT_H = 18;
const GRID = 0.25;
const PCB_Z = 10 - CHOC_PLATE_FACE_TO_PCB_FACE - 1.6;
const CAP_Z = PCB_Z + 1.6 + CHOC_PCB_FACE_TO_KEYCAP_BOTTOM;

const SCREW_D = 3;

// Layout root
const LX = 0;
const RX = 150;
const Y  = UNIT_V * -4.00;

const layoutL = keyLayoutHelper({
  offset: [LX, CAP_Z, Y],
  unitV: UNIT_V,
  unitH: UNIT_H,
  layout: [
    [0.25, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.50, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [4.50, [1.00]],
  ],
});

const layoutR = keyLayoutHelper({
  offset: [RX, CAP_Z, Y],
  unitV: 17,
  unitH: 18,
  layout: [
    [0.25, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.50, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [1.50, [1.00]],
  ],
});

const thumbs: [number, number, number, number][] = [
  [LX + UNIT_H * 6.00 + GRID * 8, CAP_Z, Y + UNIT_V * 3.50 + GRID * 10,  15],
  [RX + UNIT_H * 1.00 - GRID * 8, CAP_Z, Y + UNIT_V * 3.50 + GRID * 10, -15],
];

const screwsL = screwLayoutHelper({
  offset: [LX, 14, Y],
  positions: [
    [UNIT_H * 0.00  + GRID * 0  - SCREW_D, UNIT_V * 3.00 + GRID * 0   + SCREW_D],
    [UNIT_H * 0.00  + GRID * 0  - SCREW_D, UNIT_V * 1.50 + GRID * 47  + SCREW_D],
    [UNIT_H * 0.00  + GRID * 0  - SCREW_D, UNIT_V * 1.50 + GRID * -47 - SCREW_D],
    [UNIT_H * 0.00  + GRID * 0  - SCREW_D, UNIT_V * 0.00 + GRID * 0   - SCREW_D],
    [UNIT_H * 3.625 + GRID * 0,            UNIT_V * 0.00 + GRID * 0   - SCREW_D],
    [UNIT_H * 7.25  + GRID * 0  + SCREW_D, UNIT_V * 0.00 + GRID * 0   - SCREW_D],
    [UNIT_H * 7.25  + GRID * 0  + SCREW_D, UNIT_V * 1.50 + GRID * -47 - SCREW_D],
    [UNIT_H * 7.25  + GRID * 0  + SCREW_D, UNIT_V * 1.50 + GRID * 47  + SCREW_D],
    [UNIT_H * 7.25  + GRID * 0  + SCREW_D, UNIT_V * 3.00 + GRID * 0   + SCREW_D],
    [UNIT_H * 6.50  + GRID * 15 + SCREW_D, UNIT_V * 4.00 + GRID * 23  + SCREW_D],
    [UNIT_H * 4.50  + GRID * 3  - SCREW_D, UNIT_V * 4.00 + GRID * 23  + SCREW_D],
    [UNIT_H * 4.00  + GRID * 0  - SCREW_D, UNIT_V * 3.00 + GRID * 0   + SCREW_D],
  ],
});

const screwsR = screwLayoutHelper({
  offset: [RX, 14, Y],
  positions: [
    [UNIT_H * 0.00  + GRID * 0  - SCREW_D, UNIT_V * 3.00 + GRID * 0   + SCREW_D],
    [UNIT_H * 0.00  + GRID * 0  - SCREW_D, UNIT_V * 1.50 + GRID * 47  + SCREW_D],
    [UNIT_H * 0.00  + GRID * 0  - SCREW_D, UNIT_V * 1.50 + GRID * -47 - SCREW_D],
    [UNIT_H * 0.00  + GRID * 0  - SCREW_D, UNIT_V * 0.00 + GRID * 0   - SCREW_D],
    [UNIT_H * 3.625 + GRID * 0,            UNIT_V * 0.00 + GRID * 0   - SCREW_D],
    [UNIT_H * 7.25  + GRID * 0  + SCREW_D, UNIT_V * 0.00 + GRID * 0   - SCREW_D],
    [UNIT_H * 7.25  + GRID * 0  + SCREW_D, UNIT_V * 1.50 + GRID * -47 - SCREW_D],
    [UNIT_H * 7.25  + GRID * 0  + SCREW_D, UNIT_V * 1.50 + GRID * 47  + SCREW_D],
    [UNIT_H * 7.25  + GRID * 0  + SCREW_D, UNIT_V * 3.00 + GRID * 0   + SCREW_D],
    [UNIT_H * 3.25  + GRID * 0  + SCREW_D, UNIT_V * 3.00 + GRID * 0   + SCREW_D],
    [UNIT_H * 2.50  + GRID * 15 + SCREW_D, UNIT_V * 4.00 + GRID * 23  + SCREW_D],
    [UNIT_H * 0.50  + GRID * 3  - SCREW_D, UNIT_V * 4.00 + GRID * 23  + SCREW_D],
  ],
});

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./pollux");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "left_pcb.glb"),
        pos: [UNIT_H * 0.5, PCB_Z, UNIT_V * -3.50],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "right_pcb.glb"),
        pos: [UNIT_H * 0.5 + 150, PCB_Z, UNIT_V * -3.50],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "plates.stl"),
        material: Materials.acrylic,
        pos: [[0, 0, 0]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./choc_1u.stl"),
        material: Materials.pbt,
        pos: [...layoutR[1.00], ...layoutL[1.00], ...thumbs],
      }),
      loadStl({
        group,
        data: await downloadRaw("./16mm.stl"),
        material: Materials.stainless,
        pos: [...screwsL, ...screwsR],
      }),
    ]);

    status.remove();
    return;
  },
);
