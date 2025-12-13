// Reference https://github.com/donmccurdy/three-gltf-viewer/blob/main/src/viewer.js

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ZipReader, Uint8ArrayReader, Uint8ArrayWriter, type Entry } from "@zip.js/zip.js";

const SCALE_FACTOR = 0.001;
const PW = import.meta.env.VITE_MODEL_PW;

if (!PW) {
  throw new Error("VITE_MODEL_PW is not set !");
}

THREE.Cache.enabled = true;

export const instantiateViewer = async (
  canvas: HTMLCanvasElement,
  loader: (group: THREE.Group) => Promise<void>,
) => {
  const w = canvas.width;
  const h = canvas.height;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });
  renderer.setClearColor(0xCCCCC);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = 1;
  // renderer.setSize(w, h);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#FFFFFF");

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const env = pmrem.fromScene(new RoomEnvironment()).texture;
  scene.environment = env;

  const group = new THREE.Group();
  scene.add(group);

  await loader(group);

  const box = (new THREE.Box3()).setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3);
  const ratio = Math.max(size.x / (w / 100), size.z / (h / 100 * 0.85));
  group.position.x -= center.x;
  group.position.y -= center.y;
  group.position.z -= center.z;

  const camera = new THREE.PerspectiveCamera(30, w / h, 0.01, 100);
  camera.position.set(0, ratio * 10, ratio * 5);
  // camera.lookAt(0, 0, 10000);
  // window.addEventListener("resize", () => {
  //   camera.aspect = "<new-aspect-ratio-goes-here>";
  //   camera.updateProjectionMatrix();
  //   camera.setSize("<new-width>", "<new-height>");
  // });

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.zoomToCursor = true;
  controls.screenSpacePanning = true;

  const render = () => {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
  };
  render();
};

const gltfLoader = new GLTFLoader();
export const loadGltf = ({ group, data, pos, rot, scale }: {
  group: THREE.Group,
  data: ArrayBuffer,
  pos: [number, number, number],
  rot?: [number, number, number],
  scale?: [number, number, number],
}): Promise<void> => new Promise((resolve) => {
  gltfLoader.parse(data, "", (gltf) => {
    const model = gltf.scene;
    if (rot) {
      model.rotation.set(...rot);
    }
    if (scale) {
      model.scale.set(...scale);
    }
    model.position.set(pos[0] * SCALE_FACTOR, pos[1] * SCALE_FACTOR, pos[2] * SCALE_FACTOR);
    model.updateMatrixWorld();
    group.add(model);
    resolve();
  });
});

const stlLoader = new STLLoader();
export const loadStl = ({ group, data, material, pos }: {
  group: THREE.Group,
  data: ArrayBuffer,
  material: THREE.Material,
  pos: [number, number, number][],
}): Promise<void> => new Promise((resolve) => {
  if (pos.length === 0) {
    return resolve();
  }
  const stl = stlLoader.parse(data);
  stl.rotateX(- Math.PI / 2);
  const geometries = [];
  for (let p of pos) {
    const g = stl.clone();
    g.translate(...p);
    geometries.push(g);
  }
  const mesh = new THREE.Mesh(mergeGeometries(geometries), material);
  mesh.scale.set(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
  group.add(mesh);
  resolve();
});

export const downloadZip = async (path: string) => {
  const res = await fetch(path);
  const arr = await res.bytes();
  // restore magic number
  arr[0] = 0x50;
  arr[1] = 0x4b;
  const reader = new ZipReader(new Uint8ArrayReader(arr));
  return await reader.getEntries({ filenameEncoding: "utf-8" });
};

export const downloadRaw = async (path: string) => {
  const res = await fetch(path);
  return await res.arrayBuffer();
};

export const unzipFile = async (zip: Entry[], filename: string) => {
  const entry: Entry | undefined = zip.find((e) => e.filename === filename);
  if (!entry) {
    throw new Error(`Entry not found: ${filename}.`);
  }
  if (!("getData" in entry)) {
    throw new Error(`Entry is a directory: ${filename}.`);
  }
  const arr = await entry.getData(new Uint8ArrayWriter(), { password: PW });
  return arr.buffer;
};
