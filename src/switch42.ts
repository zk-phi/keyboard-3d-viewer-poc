import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, screwLayoutHelper, UNIT } from "./helper";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const GRID = 0.297658;

// Layout root
const LX = -120;
const RX = 0;
const Y  = UNIT * -3;

const layoutL = keyLayoutHelper({
  offset: [LX, 22.6, Y],
  thumbGap: 0.25,
  layout: [
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [3.00, [null, null, null, 1.00, 1.00, 1.00]],
  ],
});

const layoutR = keyLayoutHelper({
  offset: [RX, 22.6, Y],
  thumbGap: 0.25,
  layout: [
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, null, null, null]],
  ],
});

const screwsL = screwLayoutHelper({
  offset: [LX, 6, Y],
  positions: [
    [UNIT * 1.0 + GRID *  0, UNIT * 1.0],
    [UNIT * 5.0 + GRID *  0, UNIT * 1.0],
    [UNIT * 1.0 + GRID *  0, UNIT * 2.0],
    [UNIT * 5.0 + GRID *  0, UNIT * 2.0],
    [UNIT * 3.0 + GRID * 13, UNIT * 3.0 + GRID * 14],
    [UNIT * 6.0 - GRID * 12, UNIT * 3.0 + GRID * 14],
  ],
});

const screwsR = screwLayoutHelper({
  offset: [RX, 6, Y],
  positions: [
    [UNIT * 1.0 + GRID *  0, UNIT * 1.0],
    [UNIT * 5.0 + GRID *  0, UNIT * 1.0],
    [UNIT * 1.0 + GRID *  0, UNIT * 2.0],
    [UNIT * 5.0 + GRID *  0, UNIT * 2.0],
    [UNIT * 0.0 + GRID * 12, UNIT * 3.0 + GRID * 14],
    [UNIT * 3.0 - GRID * 13, UNIT * 3.0 + GRID * 14],
  ],
});

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./switch42");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "left_pcb.glb"),
        pos: [UNIT * 0.5 - 120, 11 - 1.6, UNIT * -2.5],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "right_pcb.glb"),
        pos: [UNIT * 0.5, 11 - 1.6, UNIT * -2.5],
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
        pos: [...layoutR[1.00], ...layoutL[1.00]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./3_7mm_3.stl"),
        material: Materials.stainless,
        pos: [...screwsL, ...screwsR],
      }),
    ]);

    status.remove();
    return;
  },
);
