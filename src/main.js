import * as THREE from "three";
import Camera from "./camera";
import { meshes } from "./meshes";

const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new Camera(scene);

meshes.forEach((mesh) => {
  scene.add(mesh);
});

const gridHelper = new THREE.GridHelper(50, 50);
gridHelper.position.y = -1;

scene.add(gridHelper);

(function anim() {
  const delta = clock.getDelta();

  requestAnimationFrame(anim);

  if (camera.update(delta)) {
    console.log("rendered");
  }
})();
