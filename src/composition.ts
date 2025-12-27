import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, screwLayoutHelper } from "./helper";
import { GRID, UNIT } from "./constants";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const SCREW_D = 2.975;

// Layout root
const Y = UNIT * -4;

const layout = keyLayoutHelper({
  offset: [0, 12.1, Y],
  layout: [
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [3.50, [1.00, 1.00, 1.00, 1.00, 1.00]],
  ],
});

const SCREW_DX = 2.85 * UNIT + SCREW_D / 2;
const screws = screwLayoutHelper({
  offset: [0, 12, Y],
  positions: [
    [UNIT *  6.00 + SCREW_DX * -2,           UNIT * 4.00 + GRID * 0 + SCREW_D],
    [UNIT *  0.00 + SCREW_DX *  0 - SCREW_D, UNIT * 2.00 + GRID * 9 + SCREW_D / 2],
    [UNIT *  0.00 + SCREW_DX *  0 - SCREW_D, UNIT * 1.00 - GRID * 9 - SCREW_D / 2],
    [UNIT *  6.00 + SCREW_DX * -2,           UNIT * 0.00 + GRID * 0 - SCREW_D],
    [UNIT *  6.00 + SCREW_DX * -1,           UNIT * 0.00 + GRID * 0 - SCREW_D],
    [UNIT *  6.00 + SCREW_DX *  0,           UNIT * 0.00 + GRID * 0 - SCREW_D],
    [UNIT *  6.00 + SCREW_DX *  1,           UNIT * 0.00 + GRID * 0 - SCREW_D],
    [UNIT *  6.00 + SCREW_DX *  2,           UNIT * 0.00 + GRID * 0 - SCREW_D],
    [UNIT * 12.00 + SCREW_DX *  0 + SCREW_D, UNIT * 2.00 + GRID * 0],
    [UNIT *  6.00 + SCREW_DX *  2,           UNIT * 4.00 + GRID * 0 + SCREW_D],
    [UNIT *  6.00 + SCREW_DX *  1,           UNIT * 4.00 + GRID * 0 + SCREW_D],
    [UNIT *  6.00 + SCREW_DX *  0,           UNIT * 4.00 + GRID * 0 + SCREW_D],
    [UNIT *  6.00 + SCREW_DX * -1,           UNIT * 4.00 + GRID * 0 + SCREW_D],
  ],
});

const pcbScrews = screwLayoutHelper({
  offset: [0, 5 + 1.6, Y],
  positions: [
    [UNIT *  1.00, UNIT * 0.00 + GRID * 7],
    [UNIT *  6.00, UNIT * 0.00 + GRID * 7],
    [UNIT * 11.00, UNIT * 0.00 + GRID * 7],
    [UNIT * 11.00, UNIT * 3.00 - GRID * 7],
    [UNIT *  7.50, UNIT * 4.00 - GRID * 7],
    [UNIT *  4.50, UNIT * 4.00 - GRID * 7],
    [UNIT *  1.00, UNIT * 3.00 - GRID * 7],
  ],
});

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./composition");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "pcb.glb"),
        pos: [0, 5, Y],
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
        data: await downloadRaw("./12mm.stl"),
        material: Materials.stainless,
        pos: screws,
      }),
      loadStl({
        group,
        data: await downloadRaw("./4_6mm.stl"),
        material: Materials.translucent,
        pos: pcbScrews,
      }),
    ]);

    status.remove();
    return;
  },
);
