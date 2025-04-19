import * as THREE from "three";
import Player from "./player";
import { meshes } from "./meshes";
import CameraWrapper from "./camera";
import Entity from "./entity";

const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new CameraWrapper(scene);
const player = new Player(camera, scene);

scene.add(meshes);
const enemy = new Entity(camera, scene);
const enemyMesh = enemy.mesh;
scene.add(enemyMesh);

const gridHelper = new THREE.GridHelper(50, 50);
gridHelper.position.y = -1;

scene.add(gridHelper);

(function anim() {
  const delta = clock.getDelta();
  requestAnimationFrame(anim);

  let shouldUpdate = false;

  // Add more updates (entities, guns)
  // forceCameraUpdate = entity.update(delta) || forceCameraUpdate;
  shouldUpdate = player.update(delta) || enemy.update(delta);

  if (shouldUpdate) {
    camera.update(delta);
    enemy.update(delta);

    console.log("Rendered!");
  }
})();
