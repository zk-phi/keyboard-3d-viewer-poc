import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, UNIT } from "./helper";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const layoutL = keyLayoutHelper({
  offset: [- UNIT * 0.75, 1.6 + 12 + 1.6 + 6.6, - UNIT * 0.5],
  layout: [
    [0.50, [1.25, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.50, [1.00, 1.00, 1.00]],
  ],
});

const thumbL = keyLayoutHelper({
  offset: [- UNIT * 0.75, 1.6 + 12 + 1.6 + 6.6, UNIT * 2],
  layout: [
    [3.50, [1.00, 1.00, 1.25]],
  ],
});

const layoutR = keyLayoutHelper({
  offset: [240 - UNIT * 6.0, 1.6 + 12 + 1.6 + 6.6, - UNIT * 0.5],
  layout: [
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.25]],
    [0.75, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [3.25, [1.00, 1.00, 1.00]],
  ],
});

const thumbR = keyLayoutHelper({
  offset: [240 - UNIT * 6.0, 1.6 + 12 + 1.6 + 6.6, UNIT * 2],
  layout: [
    [0.00, [1.25, 1.00, 1.00]],
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
        pos: [0, 1.6 + 12 + 1.6 - 5.1 - 1.6, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "right_pcb.glb"),
        rot: [0, 0, Math.PI],
        pos: [240, 1.6 + 12 + 1.6 - 5.1 - 1.6 + 1.6, 0],
      }),
      loadGltf({
        group,
        data: await downloadRaw("./ProMicro.glb"),
        scale: [0.001, 0.001, 0.001],
        rot: [- Math.PI/2, 0, - Math.PI/2],
        pos: [240 - 3.4, 1.6 + 12 + 1.6 - 5.1 - 1.6 + 1.6 - 1.6 - 2.5, 19.05 - 0.3],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "top.glb"),
        pos: [0, 1.6 + 12, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "top.glb"),
        rot: [0, 0, Math.PI],
        pos: [240, 1.6 + 12 + 1.6, 0],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_00u.stl"),
        material: Materials.darkPbt,
        pos: [...layoutL[1.00], ...thumbL[1.00], ...layoutR[1.00], ...thumbR[1.00]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_25u.stl"),
        material: Materials.darkPbt,
        pos: [...layoutL[1.25], ...thumbL[1.25], ...layoutR[1.25], ...thumbR[1.25]],
      }),
    ]);

    status.remove();
    return;
  },
);
