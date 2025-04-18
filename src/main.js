import * as THREE from "three";
import * as Camera from "./camera";
import { meshes } from "./meshes";

const clock = new THREE.Clock();
const scene = new THREE.Scene();

meshes.forEach((mesh) => {
  scene.add(mesh);
});

const gridHelper = new THREE.GridHelper(50, 50);
gridHelper.position.y = 0;

scene.add(gridHelper);

Camera.init(scene);

(function anim() {
  const delta = clock.getDelta();

  requestAnimationFrame(anim);

  if (Camera.update(delta)) {
    console.log("rendered");
  }
})();
