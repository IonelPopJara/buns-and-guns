import * as THREE from "three";
import Player from "./player";
import CameraWrapper from "./camera";
import LevelManager from "./levels/levelManager";

const clock = new THREE.Clock();
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 1, 10);
const camera = new CameraWrapper(scene);

function handleNextLevel() {
  console.log("Next level loaded");
  levelManager.goToNextLevel();
}

const player = new Player(camera, scene, handleNextLevel);
const levelManager = new LevelManager(player, camera, scene);

let playing = false;

(function render() {
  const delta = clock.getDelta();

  requestAnimationFrame(render);

  if (playing || !levelManager.isLevelLoaded()) {
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

function isPlaying() {
  return playing;
}

document.pause = function () {
  playing = false;
};

document.resume = function () {
  playing = true;
};

export { isPlaying };
