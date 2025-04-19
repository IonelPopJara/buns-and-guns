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

    return false;
  }

  get mesh() {
    return this._mesh;
  }
}

function _createMesh() {
  // Create a mesh to simulate the enemy
  const geometry = new THREE.PlaneGeometry(0.5, 1.3);
  const mesh = new THREE.Mesh(geometry);
  mesh.position.set(0, -0.5, -4);

  // Load the texture
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("/textures/entity/miku.png", (texture) => {
    // Set the texture to the mesh material
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      // color: 0xffffff,
      // wireframe: true,
    });

    mesh.material = material;
  });
  // const mesh = new THREE.Mesh(,
  //   geometry,
  //   new THREE.MeshBasicMaterial({
  //     color: 0xff00f0,
  //     // side: THREE.DoubleSide,
  //     //   wireframe: true,
  //   })
  // );
  // mesh.position.set(0, 0, -4);

  return mesh;
}
