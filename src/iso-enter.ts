import * as THREE from "three";
import { instantiateViewer, loadStl, downloadZip, unzipFile } from "./core";
import { Materials, KeycapMaterials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./iso-enter");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      loadStl({
        group,
        data: await unzipFile(zip, "shell.stl"),
        material: Materials.acrylic,
        pos: [[0, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "enter.stl"),
        material: KeycapMaterials.blue,
        pos: [[0, 0, 0]],
      }),
    ]);

    status.remove();
    return;
  },
);
