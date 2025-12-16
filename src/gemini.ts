import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, addLights, downloadZip, downloadRaw, unzipFile } from "./core";
import { layoutHelper, positionHelper, backlitPositionsFromLayout } from "./helper";
import { UNIT, GRID, PLATE_TOP_TO_PCB, PCB_TO_KEYCAP } from "./constants";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const STAG    = 13/64;
const SCREW_D = 3.75;

const TOP_Z = 9;
const PCB_Z = TOP_Z + 3 - PLATE_TOP_TO_PCB;
const CAP_Z = PCB_Z + PCB_TO_KEYCAP;

const layoutL = layoutHelper({
  offset: [0, CAP_Z, UNIT * -4],
  stag: [STAG * 3, STAG * 3, STAG * 1, 0, 0, 0],
  thumbGap: STAG * 1,
  layout: [
    [0.0, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.0, [1.25, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.0, [1.50, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [3.5, [null, null, null, null, 1.25, 1.75]],
  ],
});

const layoutR = layoutHelper({
  offset: [270 - UNIT * 6.5, CAP_Z, UNIT * -4],
  stag: [0, 0, 0, STAG * 1, STAG * 3, STAG * 3],
  thumbGap: STAG * 1,
  layout: [
    [0.50, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.25, [1.00, 1.00, 1.00, 1.00, 1.00, 1.25]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.50]],
    [0.00, [1.75, 1.25, null, null, null, null]],
  ],
});

const screwsL = positionHelper({
  offset: [0, 17, UNIT * -4],
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

const screwsR = positionHelper({
  offset: [270 - UNIT * 6.5, 17, UNIT * -4],
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
        pos: [0, PCB_Z, UNIT * -4],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "right_pcb.glb"),
        pos: [270 - UNIT * 6.5, PCB_Z, UNIT * -4],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "plates.stl"),
        material: Materials.acrylicWithLed,
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
      addLights({
        group,
        material: Materials.led,
        pos: [
          ...backlitPositionsFromLayout(layoutL),
          ...backlitPositionsFromLayout(layoutR),
        ],
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
