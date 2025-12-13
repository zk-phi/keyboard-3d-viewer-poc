import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { UNIT, GRID, PCB_TO_KEYCAP } from "./constants";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./kp-19");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "pcb.glb"),
        pos: [0, 0, 0],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_00u.stl"),
        material: Materials.translucent,
        pos: [
          [GRID * 52 + UNIT * 0.0, PCB_TO_KEYCAP, GRID * 140],
          [GRID * 52 + UNIT * 1.0, PCB_TO_KEYCAP, GRID * 140],
          [GRID * 62 + UNIT * 2.0, PCB_TO_KEYCAP, GRID * 140],
          [GRID * 62 + UNIT * 3.0, PCB_TO_KEYCAP, GRID * 140],
        ],
      }),
    ]);

    status.remove();
    return;
  },
);
