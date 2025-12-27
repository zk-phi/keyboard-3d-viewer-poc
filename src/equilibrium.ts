import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, screwLayoutHelper } from "./helper";
import { UNIT, GRID, PLATE_FACE_TO_PCB_FACE, PCB_FACE_TO_KEYCAP_BOTTOM } from "./constants";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const SCREW_D = 3.1;

const TOP_Z = 9;
const PCB_Z = TOP_Z + 3 - PLATE_FACE_TO_PCB_FACE - 1.6;
const CAP_Z = PCB_Z + 1.6 + PCB_FACE_TO_KEYCAP_BOTTOM;

// Layout root
const Y = UNIT * -4;

const layout = keyLayoutHelper({
  offset: [0, CAP_Z, Y],
  layout: [
    [0.00, [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.50]],
    [0.00, [1.25, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.25]],
    [0.25, [1.50, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.50]],
    [2.25, [1.25, 1.00, 1.75, 1.75, 1.00, 1.25]],
  ],
});

const SCREW_DX = 3.125 * UNIT + SCREW_D / 2;
const screws = screwLayoutHelper({
  offset: [0, 20, Y],
  positions: [
    [UNIT * 0.00 + GRID * 0 + SCREW_DX * 0 - SCREW_D, UNIT * 4.0 + GRID * 0 + SCREW_D],
    [UNIT * 0.00 + GRID * 0 + SCREW_DX * 0 - SCREW_D, UNIT * 2.0 + GRID * 0 + SCREW_D],
    [UNIT * 0.00 + GRID * 0 + SCREW_DX * 0 - SCREW_D, UNIT * 1.0 - GRID * 9 - SCREW_D / 2],
    [UNIT * 0.00 + GRID * 0 + SCREW_DX * 0 - SCREW_D, UNIT * 0.0 + GRID * 0 - SCREW_D],
    [UNIT * 0.00 + GRID * 0 + SCREW_DX * 1 - SCREW_D, UNIT * 0.0 + GRID * 0 - SCREW_D],
    [UNIT * 0.00 + GRID * 0 + SCREW_DX * 2 - SCREW_D, UNIT * 0.0 + GRID * 0 - SCREW_D],
    [UNIT * 0.00 + GRID * 0 + SCREW_DX * 3 - SCREW_D, UNIT * 0.0 + GRID * 0 - SCREW_D],
    [UNIT * 0.00 + GRID * 0 + SCREW_DX * 4 - SCREW_D, UNIT * 0.0 + GRID * 0 - SCREW_D],
    [UNIT * 0.00 + GRID * 0 + SCREW_DX * 4 - SCREW_D, UNIT * 2.0 + GRID * 0 - SCREW_D],
    [UNIT * 0.00 + GRID * 0 + SCREW_DX * 4 - SCREW_D, UNIT * 4.0 + GRID * 0 + SCREW_D],
    [UNIT * 0.00 + GRID * 0 + SCREW_DX * 3 - SCREW_D, UNIT * 4.0 + GRID * 0 + SCREW_D],
    [UNIT * 0.00 + GRID * 0 + SCREW_DX * 2 - SCREW_D, UNIT * 4.0 + GRID * 0 + SCREW_D],
    [UNIT * 0.00 + GRID * 0 + SCREW_DX * 1 - SCREW_D, UNIT * 4.0 + GRID * 0 + SCREW_D],
  ],
});

const tiltScrews: [number, number, number][][] = [[
  [UNIT *  1.000, 3, Y + UNIT * 0.000 + 3],
  [UNIT *  6.000, 3, Y + UNIT * 0.000 + 3],
  [UNIT * 11.325, 3, Y + UNIT * 0.000 + 3],
], [
  [UNIT *  2.250, 3, Y + UNIT * 1.000 + 3],
  [UNIT *  6.250, 3, Y + UNIT * 1.000 + 3],
  [UNIT * 11.500, 3, Y + UNIT * 1.000 + 3],
], [
  [UNIT *  0.625, 3, Y + UNIT * 2.000 + 3],
  [UNIT *  6.125, 3, Y + UNIT * 2.000 + 3],
  [UNIT * 11.125, 3, Y + UNIT * 2.000 + 3],
]];

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./equilibrium");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "pcb.glb"),
        pos: [0, PCB_Z, Y],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "plates.stl"),
        material: Materials.acrylic,
        pos: [[0, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "engrave.stl"),
        material: Materials.translucent,
        pos: [[0, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "foam.stl"),
        material: Materials.foam,
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
        data: await downloadRaw("./1_25u.stl"),
        material: Materials.pbt,
        pos: layout[1.25],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_50u.stl"),
        material: Materials.pbt,
        pos: layout[1.50],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_75u.stl"),
        material: Materials.pbt,
        pos: layout[1.75],
      }),
      loadStl({
        group,
        data: await downloadRaw("./20mm.stl"),
        material: Materials.stainless,
        pos: screws,
      }),
      loadStl({
        group,
        data: await downloadRaw("./10mm.stl"),
        material: Materials.stainless,
        pos: tiltScrews[0],
      }),
      loadStl({
        group,
        data: await downloadRaw("./8mm.stl"),
        material: Materials.stainless,
        pos: tiltScrews[1],
      }),
      loadStl({
        group,
        data: await downloadRaw("./6mm.stl"),
        material: Materials.stainless,
        pos: tiltScrews[2],
      }),
    ]);

    group.rotateX(5.6 * Math.PI / 180);
    status.remove();
    return;
  },
);
