import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, addLights, downloadZip, downloadRaw, unzipFile } from "./core";
import { layoutHelper, positionHelper, backlitPositionsFromLayout } from "./helper";
import { UNIT, PLATE_TOP_TO_PCB, PCB_TO_KEYCAP } from "./constants";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const TOP_Z = 3 + 7;
const PCB_Z = TOP_Z + 3 - PLATE_TOP_TO_PCB;
const CAP_Z = PCB_Z + PCB_TO_KEYCAP;

const layout = layoutHelper({
  offset: [0, CAP_Z, UNIT * -2],
  layout: [
    [0.00, [1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00]],
  ],
});

const screws = positionHelper({
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
        material: Materials.acrylicWithLed,
        pos: [[0, 0, 0]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_00u.stl"),
        material: Materials.pbt,
        pos: layout[1.00],
      }),
      addLights({
        group,
        material: Materials.led,
        pos: backlitPositionsFromLayout(layout),
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
