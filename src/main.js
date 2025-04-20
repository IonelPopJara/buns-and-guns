import * as THREE from "three";
import Player from "./player";
import CameraWrapper from "./camera";
import LevelManager from "./levels/levelManager";

let paused = true;

const clock = new THREE.Clock();
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 1, 10);
const camera = new CameraWrapper(scene);
const player = new Player(camera, scene);
const levelManager = new LevelManager(player);

(function render() {
  const delta = clock.getDelta();
  requestAnimationFrame(render);

  if (!paused || !levelManager.isLevelLoaded()) {
    let update = false;
    update = player.update(delta) || update;
    update = levelManager.update(camera, scene, delta) || update;

    if (update) {
      camera.update(delta);
    }
  } else {
    camera.update(delta);
  }
})();

document.pauseInternal = function () {
  paused = true;
};

document.resumeInternal = function () {
  paused = false;
};

function isPaused() {
  return paused;
}

// load the game manager
const script = document.createElement('script');
script.src = "./src/gameManager.js";
document.body.append(script);

export { isPaused };
