import * as THREE from "three";
import { Collider, Direction } from "./collider";
import { Vector3 } from "three/webgpu";

const MAX_HP = 8;

export default class Entity extends THREE.Object3D {
  _cameraCollider;
  _collider;
  _camera;
  _scene;
  _mesh;
  _hp;

  constructor(cameraWrapper, scene, position) {
    super();

    this._hp = MAX_HP;

    this._scene = scene;
    this._camera = cameraWrapper.camera;
    this._cameraCollider = cameraWrapper.collider;

    this._mesh = _createMesh(position.x, position.y);
    this._collider = new Collider(this._mesh, scene);
    this.add(this._mesh);
  }

  _animateDeath() {
    // TODO: add animation
    console.log(this.uuid + " killed")
  }

  _animateHit() {
    // TODO: add animation
    console.log(this.uuid + " hit")
  }

  /**
   * @returns `true` if the entity was killed
   */
  damage(damage) {
    if (this._hp <= 0 || damage <= 0) {
      return false;
    }

    this._hp -= damage;

    if (this._hp <= 0) {
      this._animateDeath();
      return true
    }

    this._animateHit();
    return false;
  }

  update(delta) {
    // Update logic for the entity can be added here
    this._mesh.lookAt(new Vector3(this._camera.position.x,
      this._mesh.position.y, this._camera.position.z));

    if (this._hp > 0) { // still alive
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
          // Create a new vector without the y component
          const newDirection = new THREE.Vector3(
            entityDirection.x,
            0,
            entityDirection.z
          );
          this._mesh.position.addScaledVector(newDirection, 0.1 * delta);
        }

        return true;
      }
    }

    return false;
  }

  get mesh() {
    return this._mesh;
  }
}

function _createMesh(x, y) {
  // Create a mesh to simulate the enemy
  const geometry = new THREE.PlaneGeometry(0.5, 1.3);
  const mesh = new THREE.Mesh(geometry);
  mesh.position.set(x, -0.5, y);

  // Load the texture
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("/textures/entity/miku.png", (texture) => {
    // Set the texture to the mesh material
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });

    mesh.material = material;
  });

  return mesh;
}
