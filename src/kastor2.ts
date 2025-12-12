import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, screwLayoutHelper, UNIT } from "./helper";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const GRID    = 0.297658;
const SCREW_D = 3;

// Layout root
const LX = 0;
const RX = 140;
const Y  = UNIT * -4;

const layoutL = keyLayoutHelper({
  offset: [LX, 18.6, Y],
  layout: [
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.25, 1.00, 1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.50, 1.00, 1.00, 1.00, 1.00, 1.00]],
  ],
});

const layoutR = keyLayoutHelper({
  offset: [RX, 18.6, Y],
  layout: [
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.50]],
    [0.25, [1.00, 1.00, 1.00, 1.00, 1.00, 1.25]],
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.50]],
  ],
});

const screwsL = screwLayoutHelper({
  offset: [LX, 18, Y],
  positions: [
    [UNIT * 0.00 - SCREW_D, UNIT * 3.0 + SCREW_D],
    [UNIT * 0.00 - SCREW_D, UNIT * 1.5 + SCREW_D + GRID * 39],
    [UNIT * 0.00 - SCREW_D, UNIT * 1.5 - SCREW_D - GRID * 39],
    [UNIT * 0.00 - SCREW_D, UNIT * 0.0 - SCREW_D],
    [UNIT * 3.25,           UNIT * 0.0 - SCREW_D],
    [UNIT * 6.50 + SCREW_D, UNIT * 0.0 - SCREW_D],
    [UNIT * 6.50 + SCREW_D, UNIT * 1.0 - SCREW_D - GRID * 21],
    [UNIT * 6.50 + SCREW_D, UNIT * 1.0 + SCREW_D + GRID * 16],
    [UNIT * 6.50 + SCREW_D, UNIT * 3.0 + SCREW_D],
    [UNIT * 3.25 + SCREW_D, UNIT * 3.0 + SCREW_D],
  ],
});

const screwsR = screwLayoutHelper({
  offset: [RX, 18, Y],
  positions: [
    [UNIT * 0.00 - SCREW_D, UNIT * 3.0 + SCREW_D],
    [UNIT * 0.00 - SCREW_D, UNIT * 1.0 + SCREW_D + GRID * 16],
    [UNIT * 0.00 - SCREW_D, UNIT * 1.0 - SCREW_D - GRID * 21],
    [UNIT * 0.00 - SCREW_D, UNIT * 0.0 - SCREW_D],
    [UNIT * 3.25          , UNIT * 0.0 - SCREW_D],
    [UNIT * 6.50 + SCREW_D, UNIT * 0.0 - SCREW_D],
    [UNIT * 6.50 + SCREW_D, UNIT * 1.5 - SCREW_D - GRID * 39],
    [UNIT * 6.50 + SCREW_D, UNIT * 1.5 + SCREW_D + GRID * 39],
    [UNIT * 6.50 + SCREW_D, UNIT * 3.0 + SCREW_D],
    [UNIT * 3.25 + SCREW_D, UNIT * 3.0 + SCREW_D],
  ],
});

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./kastor2");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "left_pcb.glb"),
        pos: [UNIT * 0.5, 8 - 1.2, UNIT * -3.5],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "right_pcb.glb"),
        rot: [0, 0, Math.PI],
        pos: [UNIT * 6.0 + 140, 8, UNIT * -3.5],
      }),
      loadGltf({
        group,
        data: await downloadRaw("./ProMicro.glb"),
        scale: [0.001, 0.001, 0.001],
        rot: [- Math.PI/2, 0, - Math.PI/2],
        pos: [RX + UNIT * 6.0 - 3.1, 8 - 1.2 - 2.5, Y + UNIT * 1.5],
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
        pos: [...layoutL[1.00], ...layoutR[1.00]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_25u.stl"),
        material: Materials.pbt,
        pos: [...layoutL[1.25], ...layoutR[1.25]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_50u.stl"),
        material: Materials.pbt,
        pos: [...layoutL[1.50], ...layoutR[1.50]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./20mm.stl"),
        material: Materials.stainless,
        pos: [...screwsL, ...screwsR],
      }),
    ]);

    status.remove();
    return;
  },
);
