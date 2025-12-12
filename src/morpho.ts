import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, UNIT } from "./helper";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const layoutL = keyLayoutHelper({
  offset: [- UNIT * 0.75 - 160, 1.6 + 5 + 1.6 + 11.6, 0],
  layout: [
    [0.75, [null, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.25, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, null]],
    [4.25, [null, null, null, null, 1.00, 1.00, 1.00, null]],
  ],
});

const layoutR = keyLayoutHelper({
  offset: [- UNIT * 0.75, 1.6 + 5 + 1.6 + 11.6, 0],
  layout: [
    [0.75, [null, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.75, [null, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.75, [null, 1.00, 1.00, 1.00, null, null, null, null]],
  ],
});

const screwPosns: [number, number, number][] = [
  [19.05 * -0.5, 1.6, 19.05 * 0.5],
  [19.05 * 7.0, 1.6, 19.05 * 0.5],
  [19.05 * -0.5, 1.6, 19.05 * 2.5],
  [19.05 * 7.0, 1.6, 19.05 * 2.5],
  [19.05 * -0.25, 1.6, 19.05 * 3.5],
  [19.05 * 3.0, 1.6, 19.05 * 3.5],
  [19.05 * -0.5 - 160, 1.6, 19.05 * 0.5],
  [19.05 * 7.0 - 160, 1.6, 19.05 * 0.5],
  [19.05 * -0.5 - 160, 1.6, 19.05 * 2.5],
  [19.05 * 7.0 - 160, 1.6, 19.05 * 2.5],
  [19.05 * 3.5 - 160, 1.6, 19.05 * 3.5],
  [19.05 * 6.75 - 160, 1.6, 19.05 * 3.5],
];

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./morpho");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "left_pcb.glb"),
        pos: [-160, 5 + 1.6, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "left_bottom.glb"),
        pos: [-160, 0, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "right_pcb.glb"),
        pos: [0, 5 + 1.6, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "right_bottom.glb"),
        pos: [0, 0, 0],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_00u.stl"),
        material: Materials.pbt,
        pos: [...layoutL[1.00], ...layoutR[1.00]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./pcb_5mm_pcb.stl"),
        material: Materials.stainless,
        pos: screwPosns,
      }),
    ]);

    status.remove();
    return;
  },
);
