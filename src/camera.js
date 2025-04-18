import * as THREE from 'three';
import CameraControls from 'camera-controls';

var cameraControls;
var renderer;
var camera;
var scene;

function init(recurgitatedScene) {
    scene = recurgitatedScene;
    CameraControls.install({ THREE: THREE });

    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(60, 1, 0.01, 100);

    camera.position.set(0, 0, 5);
    
    renderer.render(scene, camera);
    document.body.appendChild(renderer.domElement);

    cameraControls = new CameraControls(camera, renderer.domElement);
    
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
    const result = cameraControls.update(delta)

    if(result) {
        renderer.render(scene, camera);
    }

    return result;
}

export {init, update }