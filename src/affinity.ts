import * as THREE from "three";
import { instantiateViewer, loadGltf, loadStl, downloadZip, downloadRaw, unzipFile } from "./core";
import { layoutHelper, positionHelper } from "./helper";
import { UNIT, GRID } from "./constants";
import { Materials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

const layout = layoutHelper({
  offset: [GRID * 76, 5 + 1.6 + 5.5, GRID * 150],
  layout: [
    [0.00, [1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00]],
    [0.00, [1.00, 1.00, 1.00, 1.00]],
  ],
});

const screws = positionHelper({
  offset: [GRID * 76, 1.6, GRID * 150],
  positions: [
    [UNIT * 1.0 + GRID *  0, UNIT * 4.0 + GRID * -8],
    [UNIT * 0.0 + GRID *  8, UNIT * 1.0 + GRID *  0],
    [UNIT * 3.0 + GRID *  0, UNIT * 0.0 + GRID *  8],
    [UNIT * 4.0 + GRID * -8, UNIT * 3.0 + GRID *  0],
    [UNIT * 4.0 + GRID * 32, UNIT * 3.5 + GRID *  0],
  ],
});

const coverScrews = positionHelper({
  offset: [GRID * 76, 1.6 + 5 + 1.6, GRID * 150],
  positions: [
    [UNIT * 4.0 + GRID *  8, UNIT * 3.0 + GRID * 11],
    [UNIT * 4.0 + GRID * 56, UNIT * 3.0 + GRID * 32],
  ],
});

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./affinity");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadGltf({
        group,
        data: await unzipFile(zip, "bottom.glb"),
        pos: [0, 0, 0],
      }),
      loadGltf({
        group,
        data: await unzipFile(zip, "pcb.glb"),
        pos: [0, 1.6 + 5, 0],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "cover.stl"),
        material: Materials.blackAcrylic,
        pos: [[GRID * 76, 1.6 + 5 + 1.6 + 7, GRID * 150]],
      }),
      loadStl({
        group,
        data: await downloadRaw("./choc_1u.stl"),
        material: Materials.acrylic,
        pos: layout[1.00],
      }),
      loadStl({
        group,
        data: await downloadRaw("./pcb_5mm_pcb.stl"),
        material: Materials.stainless,
        pos: screws,
      }),
      loadStl({
        group,
        data: await downloadRaw("./pcb_7mm_pcb.stl"),
        material: Materials.stainless,
        pos: coverScrews,
      }),
    ]);

    status.remove();
    return;
  },
);
