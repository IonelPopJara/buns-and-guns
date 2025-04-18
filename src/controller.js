import * as THREE from 'three';
import CameraControls from 'camera-controls';

var cameraControls;

function init(camera, renderer) {
    CameraControls.install({ THREE: THREE });
    cameraControls = new CameraControls(camera, renderer.domElement);
}

function update(delta) {
    return cameraControls.update(delta)
}

export { init, update }