import * as THREE from 'three';
import Controller from './controller'

export default class Camera {
    _scene;
    _camera;
    _renderer;
    _controller;

    constructor(_scene) {
        if (_scene == null) {
            console.error("_scene cannot be null.");
            return;
        }

        this._scene = _scene;
        this._renderer = new THREE.WebGLRenderer();
        this._camera = new THREE.PerspectiveCamera(60, 1, 0.01, 100);
        this._camera.position.set(0, 0, 0.1);
        this._controller = new Controller(this._camera, this._renderer);

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

    raycast(direction) {
        const raycaster = new THREE.Raycaster();

        raycaster.set(this._camera.position, direction);
        const intersects = raycaster.intersectObjects(this._scene.children.filter((object) => {
            return object.type != "GridHelper";
        }));

        if (intersects.length > 0) {
            return intersects[0];
        } else {
            return null;
        }
    }

    update(delta) {
        if (this._scene == null) {
            console.error("Camera must be initialized before updating.");
            return;
        }

        const result = this._controller.update(delta)

        if (result) {
            this._renderer.render(this._scene, this._camera);
        }

        return result;
    }
}