import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, screwLayoutHelper } from "./helper";
import { UNIT, GRID, PCB_TO_KEYCAP } from "./constants";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const CAP_Z = 1.6 + 5 + PCB_TO_KEYCAP;

const layout = keyLayoutHelper({
  offset: [GRID * 150, CAP_Z, GRID * -13],
  layout: [
    [0.00, [1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00]],
  ],
});

const screws = screwLayoutHelper({
  offset: [GRID * 150, 1.6, GRID * -13],
  positions: [
    [UNIT * 0.0 + GRID *  0, UNIT * 3.0],
    [UNIT * 0.0 + GRID *  0, UNIT * 0.0],
    [UNIT * 3.0 + GRID * 61, UNIT * 0.0],
    [UNIT * 3.0 + GRID * 61, UNIT * 3.0],
  ],
});

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./disco9");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "pcb.glb"),
        pos: [0, 1.6 + 5, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "bottom.glb"),
        pos: [0, 0, 0],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_00u.stl"),
        material: Materials.translucent,
        pos: layout[1.00],
      }),
      loadStl({
        group,
        data: await downloadRaw("./pcb_5mm_pcb.stl"),
        material: Materials.stainless,
        pos: screws,
      }),
    ]);

    status.remove();
    return;
  },
);
