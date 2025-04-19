import * as THREE from "three";
import Player from "./player";
import CameraWrapper from "./camera";
import LevelManager from "./levels/levelManager";

const clock = new THREE.Clock();
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 1, 10);
const camera = new CameraWrapper(scene);
const player = new Player(camera, scene);
const levelManager = new LevelManager();

(function render() {
  const delta = clock.getDelta();
  requestAnimationFrame(render);

  if (player.update(delta) ||
    levelManager.update(camera, scene, delta)) {
    camera.update(delta);

    console.log("Rendered!");
  }
})();
