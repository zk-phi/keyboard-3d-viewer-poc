import * as fs from "fs";
import { ZipWriter, Uint8ArrayReader, Uint8ArrayWriter } from "@zip.js/zip.js";

const SRC = "./keyboard-3d-models";
const DIST = "./public";
const PW = process.env.VITE_MODEL_PW;

if (!PW) {
  throw new Error("VITE_MODEL_PW is not set !");
}

const dirs = fs.readdirSync(SRC, { withFileTypes: true });

for (let dir of dirs) {
  if (!dir.isDirectory() || dir.name.startsWith(".")) {
    continue;
  }
  console.log(`Target: public/${dir.name}.zip`);

  const writer = new Uint8ArrayWriter();
  const zipper = new ZipWriter(writer);
  const files = fs.readdirSync(`${SRC}/${dir.name}`, { withFileTypes: true });
  for (let file of files) {
    if (!file.isFile() || file.name.startsWith(".")) {
      continue;
    }
    console.log(`- ${file.name}`);

    const content = fs.readFileSync(`${SRC}/${dir.name}/${file.name}`);
    await zipper.add(file.name, new Uint8ArrayReader(content), { password: PW });
  }

  await zipper.close();
  const buffer = await writer.getData();
  fs.writeFileSync(`${DIST}/${dir.name}.zip`, buffer);
}
