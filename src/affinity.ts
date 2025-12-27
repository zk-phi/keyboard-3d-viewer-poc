import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, screwLayoutHelper } from "./helper";
import { UNIT, GRID, CHOC_PCB_FACE_TO_KEYCAP_BOTTOM } from "./constants";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const PCB_Z = 5 + 1.6;
const CAP_Z = PCB_Z + 1.6 + CHOC_PCB_FACE_TO_KEYCAP_BOTTOM;

const layout = keyLayoutHelper({
  offset: [GRID * 76, CAP_Z, GRID * 150],
  layout: [
    [0.00, [1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00]],
  ],
});

const screws = screwLayoutHelper({
  offset: [GRID * 76, 1.6, GRID * 150],
  positions: [
    [UNIT * 1.0 + GRID *  0, UNIT * 4.0 + GRID * -8],
    [UNIT * 0.0 + GRID *  8, UNIT * 1.0 + GRID *  0],
    [UNIT * 3.0 + GRID *  0, UNIT * 0.0 + GRID *  8],
    [UNIT * 4.0 + GRID * -8, UNIT * 3.0 + GRID *  0],
    [UNIT * 4.0 + GRID * 32, UNIT * 3.5 + GRID *  0],
  ],
});

const coverScrews = screwLayoutHelper({
  offset: [GRID * 76, PCB_Z + 1.6, GRID * 150],
  positions: [
    [UNIT * 4.0 + GRID *  8, UNIT * 3.0 + GRID * 11],
    [UNIT * 4.0 + GRID * 56, UNIT * 3.0 + GRID * 32],
  ],
});

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./affinity");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "bottom.glb"),
        pos: [0, 0, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "pcb.glb"),
        pos: [0, PCB_Z, 0],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "cover.stl"),
        material: Materials.blackAcrylic,
        pos: [[GRID * 76, PCB_Z + 1.6 + 7, GRID * 150]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./choc_1u.stl"),
        material: Materials.acrylic,
        pos: layout[1.00],
      }),
      loadStl({
        group,
        data: await downloadRaw("./pcb_5mm_pcb.stl"),
        material: Materials.stainless,
        pos: screws,
      }),
      loadStl({
        group,
        data: await downloadRaw("./pcb_7mm_pcb.stl"),
        material: Materials.stainless,
        pos: coverScrews,
      }),
    ]);

    status.remove();
    return;
  },
);
