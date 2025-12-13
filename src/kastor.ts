import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, screwLayoutHelper } from "./helper";
import { UNIT, GRID, PLATE_TOP_TO_PCB, PCB_TO_KEYCAP } from "./constants";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const TOP_Z = 1.6 + 12;
const PCB_Z = TOP_Z + 1.6 - PLATE_TOP_TO_PCB;
const CAP_Z = PCB_Z + PCB_TO_KEYCAP;

// Layout root
const LX = - UNIT * 0.75;
const RX = 240 - UNIT * 6.0;
const Y  = UNIT * -0.5;

const layoutL = keyLayoutHelper({
  offset: [LX, CAP_Z, Y],
  thumbGap: -0.5,
  layout: [
    [0.50, [1.25, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.50, [1.00, 1.00, 1.00, null, null, null]],
    [3.50, [null, null, null, 1.00, 1.00, 1.25]],
  ],
});

const layoutR = keyLayoutHelper({
  offset: [RX, CAP_Z, Y],
  thumbGap: -0.5,
  layout: [
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.25]],
    [0.75, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [3.25, [null, null, null, 1.00, 1.00, 1.00]],
    [0.00, [1.25, 1.00, 1.00, null, null, null]],
  ],
});

const screwsL = screwLayoutHelper({
  offset: [LX, 1.6, Y],
  positions: [
    [UNIT * 0.00 + GRID *  20, UNIT * 2.0 + GRID * 11],
    [UNIT * 0.00 + GRID *  20, UNIT * 1.0 - GRID * 11],
    [UNIT * 6.75 + GRID * -14, UNIT * 1.0 + GRID *  2],
    [UNIT * 6.75 + GRID * -14, UNIT * 2.5 - GRID *  2],
  ],
});

const screwsR = screwLayoutHelper({
  offset: [RX, 1.6, Y],
  positions: [
    [UNIT * 0.00 + GRID *  14, UNIT * 2.5 - GRID *  2],
    [UNIT * 0.00 + GRID *  14, UNIT * 1.0 + GRID *  2],
    [UNIT * 6.75 + GRID * -20, UNIT * 1.0 - GRID * 11],
    [UNIT * 6.75 + GRID * -20, UNIT * 2.0 + GRID * 11],
  ],
});

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./kastor");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "bottom.glb"),
        pos: [0, 0, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "bottom.glb"),
        rot: [0, 0, Math.PI],
        pos: [240, 1.6, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "left_pcb.glb"),
        pos: [0, PCB_Z, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "right_pcb.glb"),
        rot: [0, 0, Math.PI],
        pos: [240, PCB_Z + 1.6, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "top.glb"),
        pos: [0, TOP_Z, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "top.glb"),
        rot: [0, 0, Math.PI],
        pos: [240, TOP_Z + 1.6, 0],
      }),
      loadGltf({
        group,
        data: await downloadRaw("./ProMicro.glb"),
        scale: [0.001, 0.001, 0.001],
        rot: [- Math.PI/2, 0, - Math.PI/2],
        pos: [RX + UNIT * 6.0 - 3.4, PCB_Z - 2.5, Y + UNIT * 1.5 - GRID],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_00u.stl"),
        material: Materials.darkPbt,
        pos: [...layoutL[1.00], ...layoutR[1.00]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_25u.stl"),
        material: Materials.darkPbt,
        pos: [...layoutL[1.25], ...layoutR[1.25]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./pcb_12mm_pcb.stl"),
        material: Materials.brass,
        pos: [...screwsL, ...screwsR],
      }),
    ]);

    status.remove();
    return;
  },
);
