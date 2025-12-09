import * as fs from "fs";
import { execFileSync } from "child_process";
import { ZipWriter, Uint8ArrayReader, Uint8ArrayWriter } from "@zip.js/zip.js";

const SRC = "./keyboard-3d-models";
const DIST = "./public";
const TMP = "./.tmp";

const GLB_DECIMATE_LEVEL = "0.5";

const PW = process.env.VITE_MODEL_PW;
if (!PW) {
  throw new Error("VITE_MODEL_PW is not set !");
}

const dirs = fs.readdirSync(SRC, { withFileTypes: true });

for (let dir of dirs) {
  if (dir.name.startsWith(".")) {
    continue;
  }

  if (dir.isFile() && dir.name.endsWith(".glb")) {
    console.log(`Target: ${DIST}/${dir.name}`);
    execFileSync("yarn", [
      "run", "gltfpack",
      "-si", GLB_DECIMATE_LEVEL,
      "-i", `${SRC}/${dir.name}`,
      "-o", `${DIST}/${dir.name}`,
    ]);
    continue;
  }

  if (!dir.isDirectory()) {
    continue;
  }
  console.log(`Target: ${DIST}/${dir.name}`);

  const writer = new Uint8ArrayWriter();
  const zipper = new ZipWriter(writer);
  const files = fs.readdirSync(`${SRC}/${dir.name}`, { withFileTypes: true });
  for (let file of files) {
    if (!file.isFile() || file.name.startsWith(".")) {
      continue;
    }
    console.log(`- ${file.name}`);

    // Optimize GLB with gltfpack
    // https://support.spatial.io/hc/en-us/articles/360049861591-Optimizing-3D-Models
    let path = `${SRC}/${dir.name}/${file.name}`;
    if (file.name.endsWith(".glb")) {
      const optPath = `${TMP}/${dir.name}_${file.name}`;
      execFileSync("yarn", [
        "run", "gltfpack",
        "-si", GLB_DECIMATE_LEVEL,
        "-i", path,
        "-o", optPath,
      ]);
      path = optPath;
    }

    const content = fs.readFileSync(path);
    await zipper.add(file.name, new Uint8ArrayReader(content), { password: PW });
  }

  await zipper.close();
  const arr = await writer.getData();

  // nullify magic number
  arr[0] = 0;
  arr[1] = 0;

  fs.writeFileSync(`${DIST}/${dir.name}`, arr);
}
