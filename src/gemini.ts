import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, UNIT } from "./helper";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;
const STAG_UNIT = 13/64;

const layoutL = keyLayoutHelper({
  offset: [0, 18.6, UNIT * -4],
  stag: [STAG_UNIT * 3, STAG_UNIT * 3, STAG_UNIT * 1, 0, 0, 0],
  thumbGap: STAG_UNIT * 1,
  layout: [
    [0.0, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.0, [1.25, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.0, [1.50, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [3.5, [null, null, null, null, 1.25, 1.75]],
  ],
});

const layoutR = keyLayoutHelper({
  offset: [270 - UNIT * 6.5, 18.6, UNIT * -4],
  stag: [0, 0, 0, STAG_UNIT * 1, STAG_UNIT * 3, STAG_UNIT * 3],
  thumbGap: STAG_UNIT * 1,
  layout: [
    [0.50, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.25, [1.00, 1.00, 1.00, 1.00, 1.00, 1.25]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.50]],
    [0.00, [1.75, 1.25, null, null, null, null]],
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
        pos: [0, 7 - 1.6, 19.05 * -4],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "right_pcb.glb"),
        pos: [270 - (19.05 * 6.5), 7 - 1.6, 19.05 * -4],
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
        data: await unzipFile(zip, "screws.stl"),
        material: Materials.stainless,
        pos: [[0, 0, 0]],
      }),
    ]);

    status.remove();
    return;
  },
);
