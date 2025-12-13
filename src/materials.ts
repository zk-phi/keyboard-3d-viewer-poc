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
  blackAcrylic: new THREE.MeshPhysicalMaterial({
    color: 0x666666,
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
  translucent: new THREE.MeshPhysicalMaterial({
    color: 0xEEEEEE,
    transmission: 0.5,
    thickness: 1.0,
    roughness: 0.2,
  }),
  darkPbt: new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0,
    roughness: 0.5,
  }),
  foam: new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0,
    roughness: 1.0,
  }),
  brass: new THREE.MeshStandardMaterial({
    color: 0xFFEEAA,
    metalness: 1.0,
    roughness: 0.4,
  }),
  stainless: new THREE.MeshStandardMaterial({
    color: 0xDDDDDD,
    metalness: 1.0,
    roughness: 0.4,
  }),
};
