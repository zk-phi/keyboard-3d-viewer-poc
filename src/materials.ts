import * as THREE from "three";

const LED_COLOR = new THREE.Color(40, 0, 400);
const ACRYLIC_LED_COLOR = new THREE.Color(0.8 + 0.02, 0.8, 0.8 + 0.2);
const TRANSLUCENT_LED_COLOR = new THREE.Color(0.6 + 0.04, 0.6, 0.6 + 0.4);

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
  acrylicWithLed: new THREE.MeshPhysicalMaterial({
    color: ACRYLIC_LED_COLOR,
    transmission: 1.0,
    thickness: 3.0,
    metalness: 0,
    roughness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0,
    emissive: LED_COLOR,
    emissiveIntensity: 0.005,
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
    color: 0xFFFFFF,
    transmission: 0.5,
    thickness: 1.0,
    roughness: 0.2,
  }),
  translucentWithLed: new THREE.MeshPhysicalMaterial({
    color: TRANSLUCENT_LED_COLOR,
    transmission: 0.5,
    thickness: 1.0,
    roughness: 0.2,
    emissive: LED_COLOR,
    emissiveIntensity: 0.005,
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
  led: new THREE.MeshBasicMaterial({
    color: LED_COLOR,
  }),
};
