import * as THREE from 'three';
import PlayerController from './controller'

export default class Camera {
    _scene;
    _camera;
    _renderer;
    _playerController;
    _hasRenderedFirstFrame;

    constructor(_scene) {
        if (_scene == null) {
            console.error("_scene cannot be null.");
            return;
        }

        this._scene = _scene;
        this._hasRenderedFirstFrame = false;
        this._renderer = new THREE.WebGLRenderer();
        this._camera = new THREE.PerspectiveCamera(60, 1, 0.01, 100);
        this._camera.position.set(0, 0, 0.1);
        this._playerController = new PlayerController(this._camera, this._scene, this._renderer);

        this._renderer.render(_scene, this._camera);
        document.body.appendChild(this._renderer.domElement);

        window.addEventListener('resize', () => this._resizeCamera());
        this._resizeCamera();
    }

    _resizeCamera() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);

        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();

        this._renderer.render(this._scene, this._camera);
    }

    update(delta) {
        if (this._scene == null) {
            console.error("Camera must be initialized before updating.");
            return;
        }

        const result = this._playerController.update(delta)

        if (result || !this._hasRenderedFirstFrame) {
            this._renderer.render(this._scene, this._camera);
        }

        this._hasRenderedFirstFrame = true;

        return result;
    }
}