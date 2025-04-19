import * as THREE from "three";
import { Collider, Direction } from "./collider";

export default class Entity extends THREE.Object3D {
  constructor(cameraWrapper, scene) {
    super();
    this._camera = cameraWrapper.camera;
    // Get the camera collider
    this._cameraCollider = cameraWrapper.collider;

    this._mesh = _createMesh();
    this._collider = new Collider(this._mesh, scene);
    this.add(this._mesh);
  }

  update(delta) {
    // Update logic for the entity can be added here
    this._mesh.lookAt(this._camera.position);

    // Get the world direction of the entity
    const entityDirection = new THREE.Vector3();
    this._mesh.getWorldDirection(entityDirection);
    entityDirection.normalize();

    // Get the first intersection with the camera
    const firstIntersectName = this._collider.getFirstIntersect(
      entityDirection,
      this._cameraCollider
    );

    if (firstIntersectName === "cameraCollider") {
      // Update position
      if (
        this._collider.getAllowedTravelDistanceWithCamera(
          Direction.FORWARD,
          this._cameraCollider
        ) > 0
      ) {
        this._mesh.position.addScaledVector(entityDirection, 1.0 * delta);
      }

      return true;
    }

    return false;
  }

  get mesh() {
    return this._mesh;
  }
}

function _createMesh() {
  // Create a mesh to simulate the enemy
  const geometry = new THREE.PlaneGeometry(1, 2);

  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: 0xff00f0,
      // side: THREE.DoubleSide,
      //   wireframe: true,
    })
  );
  mesh.position.set(0, 0, -4);

  return mesh;
}
