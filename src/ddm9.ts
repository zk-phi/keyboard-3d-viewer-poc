import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper } from "./helper";
import { UNIT_V, UNIT_H, PCB_FACE_TO_KEYCAP_BOTTOM } from "./constants-choc";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const SCREW_D = 2.5;

const PCB_Z = 5 + 1.0;
const CAP_Z = PCB_Z + 1.0 + PCB_FACE_TO_KEYCAP_BOTTOM;

// Layout root
const X = 35;
const Y = 2;

const layout = keyLayoutHelper({
  offset: [X, CAP_Z, Y],
  unitV: UNIT_V,
  unitH: UNIT_H,
  layout: [
    [0.00, [1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00]],
  ],
});

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./ddm9");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "pcb.glb"),
        pos: [0, PCB_Z, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "bottom.glb"),
        pos: [0, 0, 0],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_5mm_1.stl"),
        material: Materials.stainless,
        pos: [
          [     SCREW_D, 1.0,      SCREW_D],
          [     SCREW_D, 1.0, 55 - SCREW_D],
          [91 - SCREW_D, 1.0,      SCREW_D],
          [91 - SCREW_D, 1.0, 55 - SCREW_D],
        ],
      }),
      loadStl({
        group,
        data: await downloadRaw("./choc_1u.stl"),
        material: Materials.acrylic,
        pos: layout[1.00],
      }),
    ]);

    status.remove();
    return;
  },
);
