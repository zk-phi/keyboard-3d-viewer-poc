import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, screwLayoutHelper } from "./helper";
import { UNIT, PLATE_FACE_TO_PCB_FACE, PCB_FACE_TO_KEYCAP_BOTTOM } from "./constants";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const TOP_Z = 3 + 7;
const PCB_Z = TOP_Z + 3 - PLATE_FACE_TO_PCB_FACE - 1.6;
const CAP_Z = PCB_Z + 1.6 + PCB_FACE_TO_KEYCAP_BOTTOM;

const layout = keyLayoutHelper({
  offset: [0, CAP_Z, UNIT * -2],
  layout: [
    [0.00, [1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00]],
  ],
});

const screws = screwLayoutHelper({
  offset: [0, 3, UNIT * -2],
  positions: [
    [UNIT * 0.5, UNIT * 2.0],
    [UNIT * 0.5, UNIT * 0.0],
    [UNIT * 2.5, UNIT * 0.0],
    [UNIT * 2.5, UNIT * 2.0],
  ],
});

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./hifumi");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "pcb.glb"),
        pos: [0, PCB_Z, UNIT * -2],
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
        pos: layout[1.00],
      }),
      loadStl({
        group,
        data: await downloadRaw("./3_7mm_3.stl"),
        material: Materials.stainless,
        pos: screws,
      }),
    ]);

    status.remove();
    return;
  },
);
