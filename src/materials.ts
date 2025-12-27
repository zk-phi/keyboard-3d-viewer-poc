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

export const KeycapMaterials = {
  // ISO Enter
  blue: new THREE.MeshBasicMaterial({ color: 0x0033FF }),
  // Common
  spacer: new THREE.MeshBasicMaterial({ color: 0xDDDDDD }),
  components: new THREE.MeshBasicMaterial({ color: 0x000000 }),
  cover: new THREE.MeshBasicMaterial({ color: 0xEEEEEE, transparent: true, opacity: 0.7 }),
  coverBk: new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.7 }),
  pcbBk: new THREE.MeshBasicMaterial({ color: 0x333333 }),
  plateStainless: new THREE.MeshBasicMaterial({ color: 0xE5E5E5 }),
  plateBlack: new THREE.MeshBasicMaterial({ color: 0x000000 }),
  // Helix
  swInk: new THREE.MeshBasicMaterial({ color: 0x333333 }),
  capOliviaBase: new THREE.MeshBasicMaterial({ color: 0xFFFFFF }),
  capOliviaMod: new THREE.MeshBasicMaterial({ color: 0x4C4C4C }),
  capOliviaThumb: new THREE.MeshBasicMaterial({ color: 0xFFCCCC }),
  // Ergo42
  swSky: new THREE.MeshBasicMaterial({ color: 0xCCFFFF }),
  capAquaBase: new THREE.MeshBasicMaterial({ color: 0xFFFFFF }),
  capAquaMod: new THREE.MeshBasicMaterial({ color: 0x7FE5E5 }),
  capAquaThumbs: new THREE.MeshBasicMaterial({ color: 0x3399B2 }),
  // Corne
  imkCase: new THREE.MeshBasicMaterial({ color: 0xB2B2B2 }),
  pcbPurple: new THREE.MeshBasicMaterial({ color: 0x7F007F }),
  swMilky: new THREE.MeshBasicMaterial({ color: 0xFFFFE5 }),
  capLaserBase: new THREE.MeshBasicMaterial({ color: 0x000099 }),
  capLaserMod: new THREE.MeshBasicMaterial({ color: 0x191966 }),
  capLaserThumb: new THREE.MeshBasicMaterial({ color: 0xE51900 }),
  // Claw44
  swCream: new THREE.MeshBasicMaterial({ color: 0xFFE5B2 }),
  capMjf: new THREE.MeshBasicMaterial({ color: 0x4C4C4C }),
};
