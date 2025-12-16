// Reference https://github.com/donmccurdy/three-gltf-viewer/blob/main/src/viewer.js

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { SMAAEffect, BloomEffect, BrightnessContrastEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import { EffectComposer as ThreeEffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass as ThreeOutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass as ThreeRenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass as ThreeBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { SSAOPass as ThreeSSAOPass } from "three/addons/postprocessing/SSAOPass.js";
import { ZipReader, Uint8ArrayReader, Uint8ArrayWriter, type Entry } from "@zip.js/zip.js";
import { SCALE_FACTOR } from "./constants";

const PW = import.meta.env.VITE_MODEL_PW;

if (!PW) {
  throw new Error("VITE_MODEL_PW is not set !");
}

THREE.Cache.enabled = true;

//const POSTPROCESSOR = "postprocessing";
//const POSTPROCESSOR = "three";
const POSTPROCESSOR = null;

export const instantiateViewer = async (
  canvas: HTMLCanvasElement,
  loader: (group: THREE.Group) => Promise<void>,
) => {
  const w = canvas.width;
  const h = canvas.height;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    ...(POSTPROCESSOR === "postprocessing" ? {
      powerPreference: "high-performance",
      antialias: false,
      stencil: false,
      depth: false,
    } : {
      antialias: true,
    })
  });
  renderer.setClearColor(0xCCCCCC);
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

  const renderFn = (() => {
    if (POSTPROCESSOR === "postprocessing") {
      const composer = new EffectComposer(renderer, {
        frameBufferType: THREE.HalfFloatType,
      });
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new EffectPass(camera, new BloomEffect({
        intensity: 1.0,
      })));
      composer.addPass(new EffectPass(camera, new BrightnessContrastEffect({
        brightness: -0.04,
        contrast: 0.1,
      })));
      composer.addPass(new EffectPass(camera, new SMAAEffect()));
      return () => composer.render();
    }
    if (POSTPROCESSOR === "three") {
      const composer = new ThreeEffectComposer(renderer);
      composer.setPixelRatio(window.devicePixelRatio);
      composer.addPass(new ThreeRenderPass(scene, camera));
      composer.addPass(new ThreeBloomPass(new THREE.Vector2(w, h), 0.3, 1.0, 1.0));
      composer.addPass(new ThreeOutputPass());
      return () => composer.render();
    }
    return () => renderer.render(scene, camera);
  })();

  const render = () => {
    requestAnimationFrame(render);
    controls.update();
    renderFn();
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

// NOTE: I've tried InstancedMesh, but it did not work on some keyboards
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
  for (const p of pos) {
    const g = stl.clone();
    g.translate(...p);
    geometries.push(g);
  }
  const mesh = new THREE.Mesh(mergeGeometries(geometries), material);
  mesh.scale.set(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
  group.add(mesh);
  resolve();
});

export const addLights = ({ group, size, material, pos }: {
  group: THREE.Group,
  size: number,
  material: THREE.Material,
  pos: [number, number, number][],
}): Promise<void> => new Promise((resolve) => {
  const sphere = new THREE.CircleGeometry(3.0 / 2, 16);
  const geometries = [];
  for (const p of pos) {
    const g = sphere.clone();
    g.rotateX(- Math.PI / 2)
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
