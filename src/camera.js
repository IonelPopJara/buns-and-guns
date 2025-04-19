import * as THREE from "three";

export default class CameraWrapper {
  _scene;

  camera;
  renderer;

  constructor(_scene) {
    if (_scene == null) {
      console.error("Scene cannot be null.");
      return;
    }

    this._scene = _scene;
    this._hasRenderedFirstFrame = false;
    this.renderer = new THREE.WebGLRenderer();
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.01, 100);
    this.camera.position.set(0, 0, 0.1);

    this.renderer.render(_scene, this.camera);
    document.body.appendChild(this.renderer.domElement);

    window.addEventListener("resize", () => this._resizeCamera());
    this._resizeCamera();

    // Create a camera mesh
    const cameraCollider = new THREE.Mesh(
      new THREE.SphereGeometry(0.5), // or BoxGeometry
      new THREE.MeshBasicMaterial({ visible: false }) // or true if debugging
    );
    cameraCollider.position.copy(this.camera.position);
    this._scene.add(cameraCollider);

    cameraCollider.name = "cameraCollider";
    this.cameraCollider = cameraCollider;
  }

  _resizeCamera() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.render(this._scene, this.camera);
  }

  update() {
    if (this._scene == null) {
      console.error("Camera must be initialized before updating.");
      return;
    }

    this.renderer.render(this._scene, this.camera);
    this.cameraCollider.position.copy(this.camera.position);
  }

  get collider() {
    return this.cameraCollider;
  }
}
