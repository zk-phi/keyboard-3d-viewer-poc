import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, screwLayoutHelper, UNIT } from "./helper";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

// Layout root
const LX = -160;
const RX = 0;

const layoutL = keyLayoutHelper({
  offset: [LX + UNIT * -0.75, 1.6 + 5 + 1.6 + 11.6, 0],
  layout: [
    [0.75, [null, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.25, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, null]],
    [4.25, [null, null, null, null, 1.00, 1.00, 1.00, null]],
  ],
});

const layoutR = keyLayoutHelper({
  offset: [RX + UNIT * -0.75, 1.6 + 5 + 1.6 + 11.6, 0],
  layout: [
    [0.75, [null, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.75, [null, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.75, [null, 1.00, 1.00, 1.00, null, null, null, null]],
  ],
});

const screwsL = screwLayoutHelper({
  offset: [LX + UNIT * -0.75, 1.6, 0],
  positions: [
    [UNIT * 0.25, UNIT * 0.5],
    [UNIT * 7.75, UNIT * 0.5],
    [UNIT * 0.25, UNIT * 2.5],
    [UNIT * 7.75, UNIT * 2.5],
    [UNIT * 4.25, UNIT * 3.5],
    [UNIT * 7.50, UNIT * 3.5],
  ],
});

const screwsR = screwLayoutHelper({
  offset: [RX + UNIT * -0.75, 1.6, 0],
  positions: [
    [UNIT * 0.25, UNIT * 0.5],
    [UNIT * 7.75, UNIT * 0.5],
    [UNIT * 0.25, UNIT * 2.5],
    [UNIT * 7.75, UNIT * 2.5],
    [UNIT * 0.50, UNIT * 3.5],
    [UNIT * 3.75, UNIT * 3.5],
  ],
});

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
        pos: [...screwsL, ...screwsR],
      }),
    ]);

    status.remove();
    return;
  },
);
