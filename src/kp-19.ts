import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, addLights, downloadZip, downloadRaw, unzipFile } from "./core";
import { UNIT, GRID, PCB_TO_KEYCAP } from "./constants";
import { Materials, ledOn, ledOff } from "./materials";
import { backlitPositionsFromLayout } from "./helper";

const status = document.getElementById("status") as HTMLDivElement;

document.getElementById("led")!.addEventListener("input", (e) => {
  const target = e.target! as HTMLInputElement;
  if (target.checked) {
    ledOn();
  } else {
    ledOff();
  }
});

const layout: { [1.00]: [number, number, number][] } = {
  [1.00]: [
    [GRID * 52 + UNIT * 0.0, PCB_TO_KEYCAP, GRID * 140],
    [GRID * 52 + UNIT * 1.0, PCB_TO_KEYCAP, GRID * 140],
    [GRID * 62 + UNIT * 2.0, PCB_TO_KEYCAP, GRID * 140],
    [GRID * 62 + UNIT * 3.0, PCB_TO_KEYCAP, GRID * 140],
  ],
} as const;

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
        pos: layout[1.00],
      }),
      addLights({
        group,
        material: Materials.led,
        pos: backlitPositionsFromLayout(layout),
      }),
    ]);

    // TODO: Add side LEDs

    status.remove();
    return;
  },
);
