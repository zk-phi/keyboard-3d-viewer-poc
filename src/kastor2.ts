import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, UNIT } from "./helper";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const layoutL = keyLayoutHelper({
  offset: [0, 18.6, UNIT * -4],
  layout: [
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.25, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.50, 1.00, 1.00, 1.00, 1.00, 1.00]],
  ],
});

const layoutR = keyLayoutHelper({
  offset: [140, 18.6, UNIT * -4],
  layout: [
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.25]],
    [0.25, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.25]],
  ],
});

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./kastor2");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "left_pcb.glb"),
        pos: [19.05 * 0.5, 8 - 1.2, 19.05 * -3.5],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "right_pcb.glb"),
        rot: [0, 0, Math.PI],
        pos: [19.05 * 6.0 + 140, 8, 19.05 * -3.5],
      }),
      loadGltf({
        group,
        data: await downloadRaw("./ProMicro.glb"),
        scale: [0.001, 0.001, 0.001],
        rot: [- Math.PI/2, 0, - Math.PI/2],
        pos: [19.05 * 6.0 - 3.1 + 140, 8 - 1.2 - 2.5, 19.05 * -2.5],
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
      // TODO: screws
    ]);

    status.remove();
    return;
  },
);
