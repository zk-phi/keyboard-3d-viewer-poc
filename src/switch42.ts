import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, UNIT } from "./helper";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const layoutL = keyLayoutHelper({
  offset: [-120, 22.6, UNIT * -3],
  thumbGap: 0.25,
  layout: [
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [3.00, [null, null, null, 1.00, 1.00, 1.00]],
  ],
});

const layoutR = keyLayoutHelper({
  offset: [0, 22.6, UNIT * -3],
  thumbGap: 0.25,
  layout: [
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, null, null, null]],
  ],
});

const GRID = 0.297658;
const screwPosns: [number, number, number][] = [
  [19.05 * 1.0, 6, 19.05 * -2.0],
  [19.05 * 5.0, 6, 19.05 * -2.0],
  [19.05 * 1.0, 6, 19.05 * -1.0],
  [19.05 * 5.0, 6, 19.05 * -1.0],
  [19.05 * 0.0 + GRID * 12, 6, GRID * 14],
  [19.05 * 3.0 - GRID * 13, 6, GRID * 14],
  [19.05 * 1.0 - 120, 6, 19.05 * -2.0],
  [19.05 * 5.0 - 120, 6, 19.05 * -2.0],
  [19.05 * 1.0 - 120, 6, 19.05 * -1.0],
  [19.05 * 5.0 - 120, 6, 19.05 * -1.0],
  [19.05 * 3.0 + GRID * 13 - 120, 6, GRID * 14],
  [19.05 * 6.0 - GRID * 12 - 120, 6, GRID * 14],
];

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
        pos: [19.05 * 0.5 - 120, 11 - 1.6, - 19.05 * 2.5],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "right_pcb.glb"),
        pos: [19.05 * 0.5, 11 - 1.6, - 19.05 * 2.5],
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
        pos: screwPosns,
      }),
    ]);

    status.remove();
    return;
  },
);
