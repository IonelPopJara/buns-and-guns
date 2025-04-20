import * as THREE from "three";

export default class Goal extends THREE.Object3D {
  _mesh;
  constructor(position) {
    super();

    const goalMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      wireframe: true,
    });

    // Create a sphere and stretch it into an ellipsoid
    const goalGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const mesh = new THREE.Mesh(goalGeometry, goalMaterial);

    // Scale it to make an ellipsoid (egg-ish shape)
    mesh.scale.set(0.6, 1, 0.6); // narrower and taller

    mesh.position.x = position.x;
    mesh.position.z = position.y;
    mesh.position.y = 0; // base aligned

    this.add(mesh);
    this._mesh = mesh;
  }

  update(delta) {
    // Make it bop up and down starting from -0.5 to 1.5
    this._mesh.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    this._mesh.rotation.y += delta * 0.5; // Rotate the goal
    return true;
  }

  get mesh() {
    return this._mesh;
  }
}
