import * as THREE from "three";

export const Materials = {
  acrylic: new THREE.MeshPhysicalMaterial({
    color: 0xEEEEEE,
    transmission: 1.0,
    thickness: 3.0,
    metalness: 0,
    roughness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0,
  }),
  pbt: new THREE.MeshStandardMaterial({
    color: 0xAAAAAA,
    metalness: 0,
    roughness: 0.5,
  }),
  darkPbt: new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0,
    roughness: 0.5,
  }),
  brass: new THREE.MeshStandardMaterial({
    color: 0xFFEEAA,
    metalness: 1.0,
    roughness: 0.1,
  }),
  stainless: new THREE.MeshStandardMaterial({
    color: 0xEEEEEE,
    metalness: 1.0,
    roughness: 0.1,
  }),
};
