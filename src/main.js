import * as THREE from "three";
import Player from "./player";
import { meshes } from "./meshes";
import CameraWrapper from "./camera";
import Entity from "./entity";

const clock = new THREE.Clock();

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 1, 10);

const camera = new CameraWrapper(scene);
const player = new Player(camera, scene);

scene.add(meshes);

const enemy = new Entity(camera, scene);
const enemyMesh = enemy.mesh;
scene.add(enemyMesh);

(function render() {
  const delta = clock.getDelta();
  requestAnimationFrame(render);

  if (player.update(delta) || enemy.update(delta)) {
    camera.update(delta);
    enemy.update(delta);

    console.log("Rendered!");
  }
})();
