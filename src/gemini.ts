import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, screwLayoutHelper, UNIT } from "./helper";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const GRID    = 0.297658;
const STAG    = 13/64;
const SCREW_D = 3.75;

// Layout root
const LX = 0;
const RX = 270 - UNIT * 6.5;
const Y  = UNIT * -4;

const layoutL = keyLayoutHelper({
  offset: [LX, 18.6, Y],
  stag: [STAG * 3, STAG * 3, STAG * 1, 0, 0, 0],
  thumbGap: STAG * 1,
  layout: [
    [0.0, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.0, [1.25, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.0, [1.50, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [3.5, [null, null, null, null, 1.25, 1.75]],
  ],
});

const layoutR = keyLayoutHelper({
  offset: [RX, 18.6, Y],
  stag: [0, 0, 0, STAG * 1, STAG * 3, STAG * 3],
  thumbGap: STAG * 1,
  layout: [
    [0.50, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.25, [1.00, 1.00, 1.00, 1.00, 1.00, 1.25]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.50]],
    [0.00, [1.75, 1.25, null, null, null, null]],
  ],
});

const screwsL = screwLayoutHelper({
  offset: [LX, 17, Y],
  positions: [
    [UNIT * 0.00 - SCREW_D, UNIT * (3.0 + STAG * 3) + SCREW_D],
    [UNIT * 0.00 - SCREW_D, UNIT * (1.5 + STAG * 3) - SCREW_D + GRID * 72],
    [UNIT * 0.00 - SCREW_D, UNIT * (1.5 + STAG * 3) + SCREW_D - GRID * 72],
    [UNIT * 0.00 - SCREW_D, UNIT * (0.0 + STAG * 3) - SCREW_D],
    [UNIT * 3.25          , UNIT * (0.0 + STAG * 0) - SCREW_D],
    [UNIT * 6.50 + SCREW_D, UNIT * (0.0 + STAG * 0) - SCREW_D],
    [UNIT * 6.50 + SCREW_D, UNIT * (1.0 + STAG * 0) - SCREW_D - GRID * 23],
    [UNIT * 6.50 + SCREW_D, UNIT * (1.0 + STAG * 0) + SCREW_D + GRID * 23],
    [UNIT * 6.50 + SCREW_D, UNIT * (4.0 + STAG * 1) + SCREW_D],
    [UNIT * 3.25 + SCREW_D, UNIT * (4.0 + STAG * 1) + SCREW_D],
  ],
});

const screwsR = screwLayoutHelper({
  offset: [RX, 17, Y],
  positions: [
    [UNIT * 0.00 - SCREW_D, UNIT * (4.0 + STAG * 1) + SCREW_D],
    [UNIT * 0.00 - SCREW_D, UNIT * (1.0 + STAG * 0) + SCREW_D + GRID * 23],
    [UNIT * 0.00 - SCREW_D, UNIT * (1.0 + STAG * 0) - SCREW_D - GRID * 23],
    [UNIT * 0.00 - SCREW_D, UNIT * (0.0 + STAG * 0) - SCREW_D],
    [UNIT * 3.25          , UNIT * (0.0 + STAG * 0) - SCREW_D],
    [UNIT * 6.50 + SCREW_D, UNIT * (0.0 + STAG * 3) - SCREW_D],
    [UNIT * 6.50 + SCREW_D, UNIT * (1.5 + STAG * 3) + SCREW_D - GRID * 72],
    [UNIT * 6.50 + SCREW_D, UNIT * (1.5 + STAG * 3) - SCREW_D + GRID * 72],
    [UNIT * 6.50 + SCREW_D, UNIT * (3.0 + STAG * 3) + SCREW_D],
    [UNIT * 3.25 - SCREW_D, UNIT * (4.0 + STAG * 1) + SCREW_D],
  ],
});

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./gemini");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "left_pcb.glb"),
        pos: [0, 7 - 1.6, UNIT * -4],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "right_pcb.glb"),
        pos: [270 - UNIT * 6.5, 7 - 1.6, UNIT * -4],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "plates.stl"),
        material: Materials.acrylic,
        pos: [[0, 0, 0]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_00u.stl"),
        material: Materials.pbt,
        pos: [...layoutL[1.00], ...layoutR[1.00]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_25u.stl"),
        material: Materials.pbt,
        pos: [...layoutL[1.25], ...layoutR[1.25]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_50u.stl"),
        material: Materials.pbt,
        pos: [...layoutL[1.50], ...layoutR[1.50]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_75u.stl"),
        material: Materials.pbt,
        pos: [...layoutL[1.75], ...layoutR[1.75]],
      }),
      loadStl({
        group,
        data: await downloadRaw("19mm.stl"),
        material: Materials.stainless,
        pos: [...screwsL, ...screwsR],
      }),
    ]);

    status.remove();
    return;
  },
);
