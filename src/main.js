import * as THREE from "three";
import Player from './player'
import { meshes } from "./meshes";
import CameraWrapper from "./camera";

const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new CameraWrapper(scene);
const player = new Player(camera, scene);

meshes.forEach((mesh) => {
  scene.add(mesh);
});

const gridHelper = new THREE.GridHelper(50, 50);
gridHelper.position.y = -1;

scene.add(gridHelper);

(function anim() {
  const delta = clock.getDelta();
  requestAnimationFrame(anim);

  let shouldUpdate = false;

  // Add more updates (entities, guns)
  // forceCameraUpdate = entity.update(delta) || forceCameraUpdate;
  shouldUpdate = player.update(delta);
  
  if (shouldUpdate) {
    camera.update(delta);

    console.log("Rendered!");
  }
})();
