import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, addLights, downloadZip, downloadRaw, unzipFile } from "./core";
import { layoutHelper, positionHelper, backlitPositionsFromLayout } from "./helper";
import { UNIT, GRID, PCB_TO_KEYCAP } from "./constants";
import { Materials, ledOn, ledOff } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

document.getElementById("led")!.addEventListener("input", (e) => {
  const target = e.target! as HTMLInputElement;
  if (target.checked) {
    ledOn();
  } else {
    ledOff();
  }
});

const CAP_Z = 1.6 + 5 + PCB_TO_KEYCAP;

const layout = layoutHelper({
  offset: [GRID * 150, CAP_Z, GRID * -13],
  layout: [
    [0.00, [1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00]],
  ],
});

const screws = positionHelper({
  offset: [GRID * 150, 1.6, GRID * -13],
  positions: [
    [UNIT * 0.0 + GRID *  0, UNIT * 3.0],
    [UNIT * 0.0 + GRID *  0, UNIT * 0.0],
    [UNIT * 3.0 + GRID * 61, UNIT * 0.0],
    [UNIT * 3.0 + GRID * 61, UNIT * 3.0],
  ],
});

const extraBacklits = positionHelper({
  offset: [GRID * 150, 1.6 + 5 + 1.6 + 1, GRID * -13],
  positions: [
    [UNIT * 1.0 - GRID * 1, UNIT * 0.5],
    [UNIT * 2.0 - GRID * 1, UNIT * 0.5],
    [UNIT * 1.0 - GRID * 1, UNIT * 1.5],
    [UNIT * 2.0 - GRID * 1, UNIT * 1.5],
    [UNIT * 1.0 - GRID * 1, UNIT * 2.5],
    [UNIT * 2.0 - GRID * 1, UNIT * 2.5],
    [UNIT * 1.5 - GRID * 1, UNIT * 1.0],
    [UNIT * 2.5 - GRID * 1, UNIT * 1.0],
    [UNIT * 0.5 - GRID * 1, UNIT * 1.0],
    [UNIT * 0.5 - GRID * 1, UNIT * 2.0],
    [UNIT * 1.5 - GRID * 1, UNIT * 2.0],
    [UNIT * 2.5 - GRID * 1, UNIT * 2.0],
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
      addLights({
        group,
        material: Materials.led,
        pos: [
          ...backlitPositionsFromLayout(layout),
          ...extraBacklits,
        ],
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
