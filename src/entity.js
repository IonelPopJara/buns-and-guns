import * as THREE from "three";
import { Collider, Direction } from "./collider";
import { Vector3 } from "three/webgpu";
import { texture } from "three/tsl";
import { isPlaying } from "./main";

const MAX_HP = 8;
const WALK_FRAMES = 4;
const DEATH_FRAMES = 3;
const FRAME_TIME = 300;
const PATH = "/textures/entity/bunny/";

export default class Entity extends THREE.Object3D {
  _cameraCollider;
  _animationId;
  _collider;
  _camera;
  _scene;
  _dead;
  _mesh;
  _hp;

  _deathTextures;
  _walkTextures;
  _hitTexture;

  constructor(cameraWrapper, scene, position) {
    super();

    this._hp = MAX_HP;
    this._dead = false;

    this._scene = scene;
    this._camera = cameraWrapper.camera;
    this._cameraCollider = cameraWrapper.collider;

    const textureLoader = new THREE.TextureLoader();
    this._hitTexture = textureLoader.load(PATH + "hit.png");
    this._walkTextures = [];
    for (let frame = 1; frame <= WALK_FRAMES; frame++) {
      this._walkTextures.push(textureLoader.load(PATH + "/walk/" + frame + ".png"))
    }
    this._deathTextures = [];
    for (let frame = 1; frame <= DEATH_FRAMES; frame++) {
      this._deathTextures.push(textureLoader.load(PATH + "/death/" + frame + ".png"))
    }

    this._mesh = _createMesh(position.x, position.y);
    this._collider = new Collider(this._mesh, scene);
    this.add(this._mesh);

    this._animateWalk.bind(this);
    this._animateHit.bind(this);
    this._animateDeath.bind(this);

    this._animateWalk();
  }

  _animateDeath(deathHandler) {
    if (this._animationId) {
      clearInterval(this._animationId);
    }

    // So that the shooting raycaster cannot find it
    this._mesh.type = null;

    let index = 0;
    this._mesh.material =
      this._generateMaterial(this._deathTextures[index++]);

    this._animationId = setInterval(() => {
      if(!isPlaying()) {
        return;
      }
      
      if (index < this._deathTextures.length) {
        this._mesh.material =
          this._generateMaterial(this._deathTextures[index++]);
      } else {
        this._dead = true;

        if (deathHandler) {
          deathHandler();
        }

        if (this._animationId) {
          clearInterval(this._animationId);
        }
      }
    }, FRAME_TIME);
  }

  _animateWalk() {
    if (this._animationId) {
      clearInterval(this._animationId);
    }

    let index = 0;
    this._mesh.material =
      this._generateMaterial(this._walkTextures[index++]);
    this._animationId = setInterval(() => {
      if(!isPlaying()) {
        return;
      }

      this._mesh.material =
        this._generateMaterial(this._walkTextures[index++]);

      index = index % this._walkTextures.length;
    }, FRAME_TIME);
  }

  _animateHit() {
    if (this._animationId) {
      clearInterval(this._animationId);
    }

    let index = 0;
    this._mesh.material =
      this._generateMaterial(this._hitTexture);
    this._animationId = setInterval(() => {
      if(!isPlaying()) {
        return;
      }

      this._mesh.material =
        this._generateMaterial(this._walkTextures[index++]);

      index = index % this._walkTextures.length;
    }, FRAME_TIME);
  }

  _generateMaterial(texture) {
    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    })
  }

  damage(damage, deathHandler) {
    if (this._hp <= 0 || damage <= 0) {
      return false;
    }

    this._hp -= damage;

    if (this._hp <= 0) {
      this._animateDeath(deathHandler);
    } else {
      this._animateHit();
    }
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
          this._mesh.position.addScaledVector(newDirection, delta);
        }

        return true;
      }
    } else if (!this._dead) {
      return true; // update the death animation
    }

    return false;
  }

  get mesh() {
    return this._mesh;
  }
}

function _createMesh(x, y) {
  // Create a mesh to simulate the enemy
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.4));
  mesh.position.set(x, -0.2, y);

  return mesh;
}
