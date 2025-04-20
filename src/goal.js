import * as THREE from "three";

export default class Goal extends THREE.Object3D {
  _mesh;
  constructor(position) {
    super();
    const goalMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      side: THREE.DoubleSide,
      wireframe: true,
    });

    const goalGeometry = new THREE.SphereGeometry(0.5);
    const mesh = new THREE.Mesh(goalGeometry, goalMaterial);

    mesh.position.x = position.x;
    mesh.position.z = position.y;
    mesh.position.y = -0.5; // Set the height of the goal

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
