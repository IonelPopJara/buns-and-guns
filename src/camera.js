import * as THREE from 'three';
import * as Controls from './controller'

var renderer;
var camera;
var scene;

function init(_scene) {
    scene = _scene;

    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(60, 1, 0.01, 100);

    camera.position.set(0, 0, 5);

    renderer.render(scene, camera);
    document.body.appendChild(renderer.domElement);

    Controls.init(camera, renderer);

    window.addEventListener('resize', () => resizeCamera(scene));
    resizeCamera(scene);
}

function resizeCamera(scene) {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
}

function update(delta) {
    const result = Controls.update(delta)

    if (result) {
        renderer.render(scene, camera);
    }

    return result;
}

export { init, update }