import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, UNIT } from "./helper";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const layoutL = keyLayoutHelper({
  offset: [0, 18.6, UNIT * -4],
  stag: [13/64 * 3, 13/64 * 3, 13/64 * 1, 0, 0, 0],
  layout: [
    [0, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0, [1.25, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0, [1.50, 1.00, 1.00, 1.00, 1.00, 1.00]],
  ],
});

const thumbL = keyLayoutHelper({
  offset: [UNIT * 3.5, 18.6, UNIT * (-1 + 13/64)],
  layout: [
    [0, [1.25, 1.75]],
  ],
});

const layoutR = keyLayoutHelper({
  offset: [270 - UNIT * 6.5, 18.6, UNIT * -4],
  stag: [0, 0, 0, 13/64 * 1, 13/64 * 3, 13/64 * 3],
  layout: [
    [0.50, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.25, [1.00, 1.00, 1.00, 1.00, 1.00, 1.25]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.50]],
  ],
});

const thumbR = keyLayoutHelper({
  offset: [270 - UNIT * 6.5, 18.6, UNIT * (-1 + 13/64)],
  layout: [
    [0, [1.75, 1.25]],
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
        pos: [...layoutL[1.25], ...thumbL[1.25], ...layoutR[1.25], ...thumbR[1.25]],
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
        pos: [...thumbL[1.75], ...thumbR[1.75]],
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
