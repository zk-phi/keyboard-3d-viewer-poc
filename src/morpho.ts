import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { layoutHelper, positionHelper } from "./helper";
import { UNIT, PCB_TO_KEYCAP } from "./constants";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const PCB_Z = 1.6 + 5;
const CAP_Z = PCB_Z + PCB_TO_KEYCAP;

const SCREW_POSITIONS: [number, number][] = [
  [UNIT * 0.25, UNIT * 0.5],
  [UNIT * 7.75, UNIT * 0.5],
  [UNIT * 0.25, UNIT * 2.5],
  [UNIT * 7.75, UNIT * 2.5],
  [UNIT * 4.25, UNIT * 3.5],
  [UNIT * 7.50, UNIT * 3.5],
];

const layouts = [
  layoutHelper({
    offset: [UNIT * -0.75, CAP_Z, 0],
    layout: [
      [0.75,  [null, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
      [1.00,  [null, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
      [1.25,  [null, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
      [4.125, [null, null, null, null, 1.75, 1.75, null]],
    ],
  }),
  layoutHelper({
    offset: [160 + UNIT * -0.75, CAP_Z, 0],
    layout: [
      [1.25,  [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
      [1.00,  [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
      [1.25,  [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
      [4.125, [null, null, null, 1.25, 1.25, null]],
    ],
  }),
  layoutHelper({
    offset: [UNIT * -0.75, CAP_Z, 90],
    layout: [
      [1.25, [null, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
      [1.00, [null, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
      [0.75, [null, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
      [4.00, [null, null, null, null, 1.50, 1.00, 1.00]],
    ],
  }),
  layoutHelper({
    offset: [160 + UNIT * -0.75, CAP_Z, 90],
    layout: [
      [0.75, [null, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
      [1.00, [null, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
      [0.75, [null, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]],
      [4.25, [null, null, null, null, 1.00, 1.00, 1.00]],
    ],
  }),
];

const screws = [
  ...positionHelper({
    offset: [UNIT * -0.75, 1.6, 0],
    positions: SCREW_POSITIONS,
  }),
  ...positionHelper({
    offset: [160 + UNIT * -0.75, 1.6, 0],
    positions: SCREW_POSITIONS,
  }),
  ...positionHelper({
    offset: [UNIT * -0.75, 1.6, 90],
    positions: SCREW_POSITIONS,
  }),
  ...positionHelper({
    offset: [160 + UNIT * -0.75, 1.6, 90],
    positions: SCREW_POSITIONS,
  }),
];

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./morpho");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "uniform_pcb.glb"),
        pos: [0, PCB_Z, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "reverse_x_pcb.glb"),
        pos: [160, PCB_Z, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "reverse_pcb.glb"),
        pos: [0, PCB_Z, 90],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "x_pcb.glb"),
        pos: [160, PCB_Z, 90],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "bottom.glb"),
        pos: [0, 0, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "bottom.glb"),
        pos: [160, 0, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "bottom.glb"),
        pos: [0, 0, 90],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "bottom.glb"),
        pos: [160, 0, 90],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_00u.stl"),
        material: Materials.pbt,
        pos: layouts.flatMap((l) => l[1.00]),
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_25u.stl"),
        material: Materials.pbt,
        pos: layouts.flatMap((l) => l[1.25]),
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_50u.stl"),
        material: Materials.pbt,
        pos: layouts.flatMap((l) => l[1.50]),
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_75u.stl"),
        material: Materials.pbt,
        pos: layouts.flatMap((l) => l[1.75]),
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
