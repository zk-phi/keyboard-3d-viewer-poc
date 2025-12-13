import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { keyLayoutHelper, screwLayoutHelper } from "./helper";
import { UNIT, PLATE_TOP_TO_PCB, PCB_TO_KEYCAP } from "./constants";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const TOP_Z = 10;
const PCB_Z = TOP_Z + 3 - PLATE_TOP_TO_PCB;
const CAP_Z = PCB_Z + PCB_TO_KEYCAP;

const INNTER_SCREW_D = 3.1;
const OUTER_SCREW_D  = 4.9;

const POSNS = {
  bot: { x: 0,  y: 54 },
  top: { x: 80, y: 54 },
  gas: { x: 40, y: 54 },
  san: { x: 20, y: 10 },
  cas: { x: 60, y: 10 },
}

const layout = keyLayoutHelper({
  offset: [-110, CAP_Z, UNIT * -4.0],
  layout: [
    [0.00, [1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00]],
  ],
});

const outerScrews = screwLayoutHelper({
  offset: [-110, CAP_Z, UNIT * -4.0],
  positions: [
    [UNIT * 0.0 - OUTER_SCREW_D, UNIT * 4.0 + OUTER_SCREW_D],
    [UNIT * 0.0 - OUTER_SCREW_D, UNIT * 2.0],
    [UNIT * 0.0 - OUTER_SCREW_D, UNIT * 0.0 - OUTER_SCREW_D],
    [UNIT * 1.5,                 UNIT * 0.0 - OUTER_SCREW_D],
    [UNIT * 3.5,                 UNIT * 0.0 - OUTER_SCREW_D],
    [UNIT * 4.0 + OUTER_SCREW_D, UNIT * 0.0 - OUTER_SCREW_D],
    [UNIT * 4.0 + OUTER_SCREW_D, UNIT * 2.0],
    [UNIT * 4.0 + OUTER_SCREW_D, UNIT * 4.0 + OUTER_SCREW_D],
  ],
});

const innerScrews = screwLayoutHelper({
  offset: [-110, 15, UNIT * -4.0],
  positions: [
    [UNIT * 0.0 - INNTER_SCREW_D, UNIT * 3],
    [UNIT * 0.0 - INNTER_SCREW_D, UNIT * 1],
    [UNIT * 4.0 + INNTER_SCREW_D, UNIT * 1],
    [UNIT * 4.0 + INNTER_SCREW_D, UNIT * 3],
  ],
});

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./wym16");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "full_pcb.glb"),
        pos: [-110, PCB_Z, UNIT * -4.0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "1u_pcb.glb"),
        pos: [POSNS.bot.x, PCB_Z, UNIT * -4.0 + POSNS.bot.y],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "1u_pcb.glb"),
        pos: [POSNS.top.x, PCB_Z, UNIT * -4.0 + POSNS.top.y],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "1u_pcb.glb"),
        pos: [POSNS.gas.x, PCB_Z, UNIT * -4.0 + POSNS.gas.y],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "1u_pcb.glb"),
        pos: [POSNS.san.x, PCB_Z, UNIT * -4.0 + POSNS.san.y],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "1u_pcb.glb"),
        pos: [POSNS.cas.x, PCB_Z, UNIT * -4.0 + POSNS.cas.y],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "full_case.stl"),
        material: Materials.acrylic,
        pos: [[-110, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "bottom_1u.stl"),
        material: Materials.acrylic,
        pos: [[POSNS.bot.x, 0, POSNS.bot.y]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "top_1u.stl"),
        material: Materials.acrylic,
        pos: [[POSNS.top.x, 0, POSNS.top.y]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "gasket_1u.stl"),
        material: Materials.acrylic,
        pos: [[POSNS.gas.x, 0, POSNS.gas.y]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "gasket.stl"),
        material: Materials.foam,
        pos: [[POSNS.gas.x, 0, POSNS.gas.y]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "sandwich_1u.stl"),
        material: Materials.acrylic,
        pos: [[POSNS.san.x, 0, POSNS.san.y]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "case_1u.stl"),
        material: Materials.acrylic,
        pos: [[POSNS.cas.x, 0, POSNS.cas.y]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./1_00u.stl"),
        material: Materials.pbt,
        pos: [
          ...layout[1.00],
          [UNIT * 0.5 + POSNS.bot.x, CAP_Z, UNIT * -3.5 + POSNS.bot.y],
          [UNIT * 0.5 + POSNS.top.x, CAP_Z, UNIT * -3.5 + POSNS.top.y],
          [UNIT * 0.5 + POSNS.gas.x, CAP_Z, UNIT * -3.5 + POSNS.gas.y],
          [UNIT * 0.5 + POSNS.san.x, CAP_Z, UNIT * -3.5 + POSNS.san.y],
          [UNIT * 0.5 + POSNS.cas.x, CAP_Z, UNIT * -3.5 + POSNS.cas.y],
        ],
      }),
      loadStl({
        group,
        data: await downloadRaw("./20mm.stl"),
        material: Materials.stainless,
        pos: [
          ...outerScrews,
          [- OUTER_SCREW_D + POSNS.bot.x, 20, UNIT * -4 - OUTER_SCREW_D + POSNS.bot.y],
          [- OUTER_SCREW_D + POSNS.top.x, 20, UNIT * -4 - OUTER_SCREW_D + POSNS.top.y],
          [- OUTER_SCREW_D + POSNS.gas.x, 20, UNIT * -4 - OUTER_SCREW_D + POSNS.gas.y],
          [- OUTER_SCREW_D + POSNS.san.x, 20, UNIT * -4 - OUTER_SCREW_D + POSNS.san.y],
          [- OUTER_SCREW_D + POSNS.cas.x, 20, UNIT * -4 - OUTER_SCREW_D + POSNS.cas.y],
        ],
      }),
      loadStl({
        group,
        data: await downloadRaw("./5mm.stl"),
        material: Materials.stainless,
        pos: [
          ...innerScrews,
          [- INNTER_SCREW_D + POSNS.bot.x, 13, UNIT * -3.0 + POSNS.bot.y],
          [- INNTER_SCREW_D + POSNS.top.x, 15, UNIT * -3.0 + POSNS.top.y],
        ],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "case_mount_screw.stl"),
        material: Materials.stainless,
        pos: [
          [POSNS.cas.x, 8, UNIT * -4 + POSNS.cas.y],
        ],
      }),
    ]);

    status.remove();
    return;
  },
);
