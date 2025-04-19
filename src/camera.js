import * as THREE from "three";
import {
  ChromaticAberrationEffect,
  ColorDepthEffect, EffectComposer, 
  EffectPass, PixelationEffect,
  RenderPass, VignetteEffect
} from "postprocessing";
import { Vector2 } from "three/webgpu";

export default class CameraWrapper {
  _scene;
  _composer;

  camera;
  renderer;

  constructor(_scene) {
    if (_scene == null) {
      console.error("Scene cannot be null.");
      return;
    }

    this._scene = _scene;
    this._hasRenderedFirstFrame = false;

    this.renderer = new THREE.WebGLRenderer(
      {
        powerPreference: "high-performance",
        outputColorSpace: THREE.SRGBColorSpace,
        antialias: false,
        stencil: false,
        depth: false
      }
    );

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.01, 100);
    this.camera.position.set(0, 0, 0.1);

    // Create a camera mesh
    const cameraCollider = new THREE.Mesh(
      new THREE.SphereGeometry(0.5), // or BoxGeometry
      new THREE.MeshBasicMaterial({ visible: false }) // or true if debugging
    );
    cameraCollider.position.copy(this.camera.position);
    this._scene.add(cameraCollider);

    cameraCollider.name = "cameraCollider";
    this.cameraCollider = cameraCollider;

    document.body.appendChild(this.renderer.domElement);
    window.addEventListener("resize", () => this._resizeCamera());
    this._resizeCamera();
  }

  _resizeCamera() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio)

    this._composer = new EffectComposer(this.renderer)
    this._composer.addPass(new RenderPass(this._scene, this.camera));
    this._composer.addPass(new EffectPass(this.camera, new ColorDepthEffect()))
    this._composer.addPass(new EffectPass(this.camera, new PixelationEffect(10)))
    this._composer.addPass(new EffectPass(this.camera, new ChromaticAberrationEffect({
      offset: new Vector2(0.0013, 0.0013)
    })))
    this._composer.addPass(new EffectPass(this.camera, new VignetteEffect()))

    this._composer.setSize(window.innerWidth, window.innerHeight);

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  update() {
    if (this._scene == null) {
      console.error("Camera must be initialized before updating.");
      return;
    }

    this._composer.render();
    this.cameraCollider.position.copy(this.camera.position);
  }

  get collider() {
    return this.cameraCollider;
  }
}
