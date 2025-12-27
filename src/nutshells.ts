import * as THREE from "three";
import { instantiateViewer, loadStl, downloadZip, unzipFile } from "./core";
import { UNIT } from "./constants";
import { Materials, KeycapMaterials } from "./materials";

const status = document.getElementById("status") as HTMLDivElement;

instantiateViewer(
  document.getElementById("preview") as HTMLCanvasElement,
  async (group: THREE.Group) => {
    status.innerHTML = "モデルをダウンロード中 ...";
    const zip = await downloadZip("./nutshells");
    status.innerHTML = "モデルを展開中 ...";

    await Promise.all([
      // helix
      loadStl({
        group,
        data: await unzipFile(zip, "helix-cap-base.stl"),
        material: KeycapMaterials.capOliviaBase,
        pos: [[0, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "helix-cap-mods.stl"),
        material: KeycapMaterials.capOliviaMod,
        pos: [[0, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "helix-cap-thumbs.stl"),
        material: KeycapMaterials.capOliviaThumb,
        pos: [[0, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "helix-components.stl"),
        material: KeycapMaterials.components,
        pos: [[0, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "helix-covers.stl"),
        material: KeycapMaterials.cover,
        pos: [[0, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "helix-pcbs.stl"),
        material: KeycapMaterials.pcbBk,
        pos: [[0, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "helix-plates.stl"),
        material: KeycapMaterials.plateStainless,
        pos: [[0, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "helix-shells.stl"),
        material: Materials.acrylic,
        pos: [[0, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "helix-spacers.stl"),
        material: KeycapMaterials.spacer,
        pos: [[0, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "helix-switches.stl"),
        material: KeycapMaterials.swInk,
        pos: [[0, 0, 0]],
      }),

      // ergo42
      loadStl({
        group,
        data: await unzipFile(zip, "ergo42-cap-base.stl"),
        material: KeycapMaterials.capAquaBase,
        pos: [[UNIT * 2.00, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "ergo42-cap-mods.stl"),
        material: KeycapMaterials.capAquaMod,
        pos: [[UNIT * 2.00, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "ergo42-cap-thumbs.stl"),
        material: KeycapMaterials.capAquaThumbs,
        pos: [[UNIT * 2.00, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "ergo42-components.stl"),
        material: KeycapMaterials.components,
        pos: [[UNIT * 2.00, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "ergo42-covers.stl"),
        material: KeycapMaterials.cover,
        pos: [[UNIT * 2.00, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "ergo42-pcbs.stl"),
        material: KeycapMaterials.pcbBk,
        pos: [[UNIT * 2.00, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "ergo42-plates.stl"),
        material: KeycapMaterials.cover,
        pos: [[UNIT * 2.00, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "ergo42-shells.stl"),
        material: Materials.acrylic,
        pos: [[UNIT * 2.00, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "ergo42-spacers.stl"),
        material: KeycapMaterials.spacer,
        pos: [[UNIT * 2.00, 0, 0]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "ergo42-switches.stl"),
        material: KeycapMaterials.swSky,
        pos: [[UNIT * 2.00, 0, 0]],
      }),

      // corne
      loadStl({
        group,
        data: await unzipFile(zip, "corne-cap-base.stl"),
        material: KeycapMaterials.capLaserBase,
        pos: [[0, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "corne-cap-mods.stl"),
        material: KeycapMaterials.capLaserMod,
        pos: [[0, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "corne-cap-thumbs.stl"),
        material: KeycapMaterials.capLaserThumb,
        pos: [[0, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "corne-cases.stl"),
        material: KeycapMaterials.imkCase,
        pos: [[0, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "corne-components.stl"),
        material: KeycapMaterials.components,
        pos: [[0, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "corne-covers.stl"),
        material: KeycapMaterials.cover,
        pos: [[0, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "corne-pcbs.stl"),
        material: KeycapMaterials.pcbPurple,
        pos: [[0, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "corne-plates.stl"),
        material: KeycapMaterials.cover,
        pos: [[0, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "corne-shells.stl"),
        material: Materials.acrylic,
        pos: [[0, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "corne-spacers.stl"),
        material: KeycapMaterials.spacer,
        pos: [[0, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "corne-switches.stl"),
        material: KeycapMaterials.swMilky,
        pos: [[0, 0, UNIT * -1.00]],
      }),

      // claw44
      loadStl({
        group,
        data: await unzipFile(zip, "claw44-cap-base.stl"),
        material: KeycapMaterials.capMjf,
        pos: [[UNIT * 2.00, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "claw44-cap-mods.stl"),
        material: KeycapMaterials.capMjf,
        pos: [[UNIT * 2.00, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "claw44-cap-thumbs.stl"),
        material: KeycapMaterials.capMjf,
        pos: [[UNIT * 2.00, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "claw44-components.stl"),
        material: KeycapMaterials.components,
        pos: [[UNIT * 2.00, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "claw44-covers.stl"),
        material: KeycapMaterials.coverBk,
        pos: [[UNIT * 2.00, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "claw44-pcbs.stl"),
        material: KeycapMaterials.pcbBk,
        pos: [[UNIT * 2.00, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "claw44-plates.stl"),
        material: KeycapMaterials.plateBlack,
        pos: [[UNIT * 2.00, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "claw44-shells.stl"),
        material: Materials.acrylic,
        pos: [[UNIT * 2.00, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "claw44-spacers.stl"),
        material: KeycapMaterials.spacer,
        pos: [[UNIT * 2.00, 0, UNIT * -1.00]],
      }),
      loadStl({
        group,
        data: await unzipFile(zip, "claw44-switches.stl"),
        material: KeycapMaterials.swCream,
        pos: [[UNIT * 2.00, 0, UNIT * -1.00]],
      }),
    ]);

    status.remove();
    return;
  },
);
