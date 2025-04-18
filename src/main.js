import * as THREE from 'three';
import * as Camera from './camera';

const clock = new THREE.Clock();
const scene = new THREE.Scene();

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);

scene.add(mesh);

const gridHelper = new THREE.GridHelper(50, 50);
gridHelper.position.y = - 1;

scene.add(gridHelper);

Camera.init(scene);

(function anim() {
  const delta = clock.getDelta();

  requestAnimationFrame(anim);

  if (Camera.update(delta)) {
    console.log('rendered');
  }

})();