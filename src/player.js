import * as THREE from "three";
import CameraControls from "camera-controls";
import * as HoldEvent from "https://unpkg.com/hold-event@0.2.0/dist/hold-event.module.js";
import { Collider, Direction } from "./collider";
import Gun from "./gun";
import { isPlaying } from "./main";

const HOLD_DURATION = 16.666;
const AIM_SENSITIVITY = 0.13;
const MOVE_SENSITIVITY = 0.01;
const MOVE_SIDE_SENSITIVITY = 0.005;
const ROTATE_ACCELERATION = 0.001;
const ROTATE_DECELERATION = 2;
const MAX_ROTATE_SPEED = 1.2;
const INITIAL_ROTATE_SPEED = 0.5;
const KEYCODE = {
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
};

const MAX_HP = 10;
const DAMAGE_COOLDOWN = 300;

export default class Player {
  _fireEventHandler;
  _controls;
  _collider;

  _movementVector;
  _rotateSpeed;
  _isRotating;

  constructor(cameraWrapper, scene, handleNextLevel) {
    this._handleNextLevel = handleNextLevel || null;
    // Initialize HP
    this._hp = MAX_HP;
    this._canDamage = true;

    CameraControls.install({ THREE: THREE });
    this._controls = new CameraControls(
      cameraWrapper.camera,
      cameraWrapper.renderer.domElement
    );

    this._collider = new Collider(cameraWrapper.camera, scene);

    new Gun(
      function (calculateDamage) {
        if (this._fireEventHandler) {
          const aimDirection = new THREE.Vector3();
          cameraWrapper.camera.getWorldDirection(aimDirection);
          aimDirection.normalize();

          this._fireEventHandler(
            calculateDamage,
            cameraWrapper.camera.position,
            aimDirection
          );
        }
      }.bind(this)
    );

    // Movement attributes
    this._rotateSpeed = 0.1;
    this._isRotating = false;

    this._movementVector = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
    };

    // WASD block
    const keyW = new HoldEvent.KeyboardKeyHold(KEYCODE.W, HOLD_DURATION);
    keyW.addEventListener(
      "holding",
      function () {
        if (isPlaying()) {
          this._movementVector.up = 1;
        }
      }.bind(this)
    );
    keyW.addEventListener(
      "holdEnd",
      function () {
        this._movementVector.up = 0;
      }.bind(this)
    );

    const keyA = new HoldEvent.KeyboardKeyHold(KEYCODE.A, HOLD_DURATION);
    keyA.addEventListener(
      "holding",
      function () {
        if (isPlaying()) {
          this._movementVector.left = -1;
        }
      }.bind(this)
    );
    keyA.addEventListener(
      "holdEnd",
      function () {
        this._movementVector.left = 0;
      }.bind(this)
    );

    const keyS = new HoldEvent.KeyboardKeyHold(KEYCODE.S, HOLD_DURATION);
    keyS.addEventListener(
      "holding",
      function () {
        if (isPlaying()) {
          this._movementVector.down = -1;
        }
      }.bind(this)
    );
    keyS.addEventListener(
      "holdEnd",
      function () {
        this._movementVector.down = 0;
      }.bind(this)
    );

    const keyD = new HoldEvent.KeyboardKeyHold(KEYCODE.D, HOLD_DURATION);
    keyD.addEventListener(
      "holding",
      function () {
        if (isPlaying()) {
          this._movementVector.right = 1;
        }
      }.bind(this)
    );
    keyD.addEventListener(
      "holdEnd",
      function () {
        this._movementVector.right = 0;
      }.bind(this)
    );

    // Arrows block
    const arrowLeft = new HoldEvent.KeyboardKeyHold(
      KEYCODE.ARROW_LEFT,
      HOLD_DURATION
    );
    arrowLeft.addEventListener(
      "holding",
      function (event) {
        if (!isPlaying()) {
          return;
        }

        this._isRotating = true;

        this._controls.rotate(
          AIM_SENSITIVITY *
            THREE.MathUtils.DEG2RAD *
            event.deltaTime *
            this._rotateSpeed,
          0,
          false
        );

        this._rotateSpeed +=
          ROTATE_ACCELERATION *
          event.deltaTime *
          (MAX_ROTATE_SPEED - this._rotateSpeed);
        this._rotateSpeed = Math.min(this._rotateSpeed, MAX_ROTATE_SPEED);
      }.bind(this)
    );
    arrowLeft.addEventListener(
      "holdEnd",
      function () {
        this._isRotating = false;
      }.bind(this)
    );

    const arrowRight = new HoldEvent.KeyboardKeyHold(
      KEYCODE.ARROW_RIGHT,
      HOLD_DURATION
    );
    arrowRight.addEventListener(
      "holding",
      function (event) {
        if (!isPlaying()) {
          return;
        }

        this._isRotating = true;

        this._controls.rotate(
          -AIM_SENSITIVITY *
            THREE.MathUtils.DEG2RAD *
            event.deltaTime *
            this._rotateSpeed,
          0,
          false
        );

        this._rotateSpeed +=
          ROTATE_ACCELERATION *
          event.deltaTime *
          (MAX_ROTATE_SPEED - this._rotateSpeed);
        this._rotateSpeed = Math.min(this._rotateSpeed, MAX_ROTATE_SPEED);
      }.bind(this)
    );
    arrowRight.addEventListener(
      "holdEnd",
      function () {
        this._isRotating = false;
      }.bind(this)
    );
  }

  setOnGunFireEventHandler(eventHandler) {
    this._fireEventHandler = eventHandler;
  }

  update(delta) {
    const movementDirection = new THREE.Vector2(
      this._movementVector.right + this._movementVector.left,
      this._movementVector.up + this._movementVector.down
    ).normalize();

    // Move forward/backward
    if (movementDirection.y > 0) {
      this._controls.forward(
        Math.min(
          MOVE_SENSITIVITY * delta * movementDirection.y * 1000,
          this._collider.getAllowedTravelDistance(Direction.FORWARD)
        ),
        false
      );

      let goalIntersected = this._collider.isGoalIntersected(Direction.FORWARD);
      if (goalIntersected) {
        console.log("Goal intersected!");
        this._handleNextLevel();
      }
    } else if (movementDirection.y < 0) {
      this._controls.forward(
        -Math.min(
          MOVE_SENSITIVITY * delta * Math.abs(movementDirection.y) * 1000,
          this._collider.getAllowedTravelDistance(Direction.BACKWARD)
        ),
        false
      );

      let goalIntersected = this._collider.isGoalIntersected(
        Direction.BACKWARD
      );
      if (goalIntersected) {
        console.log("Goal intersected!");
      }
    }

    // Move left/right
    if (movementDirection.x > 0) {
      this._controls.truck(
        Math.min(
          MOVE_SIDE_SENSITIVITY * delta * movementDirection.x * 1000,
          this._collider.getAllowedTravelDistance(Direction.RIGHT)
        ),
        0,
        false
      );

      let goalIntersected = this._collider.isGoalIntersected(Direction.RIGHT);
      if (goalIntersected) {
        console.log("Goal intersected!");
      }
    } else if (movementDirection.x < 0) {
      this._controls.truck(
        -Math.min(
          MOVE_SIDE_SENSITIVITY * delta * Math.abs(movementDirection.x) * 1000,
          this._collider.getAllowedTravelDistance(Direction.LEFT)
        ),
        0,
        false
      );
      let goalIntersected = this._collider.isGoalIntersected(Direction.LEFT);
      if (goalIntersected) {
        console.log("Goal intersected!");
      }
    }

    // Reset movement vector
    this._movementVector = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
    };

    if (!this._isRotating) {
      this._rotateSpeed -= ROTATE_DECELERATION * delta;
      this._rotateSpeed = Math.max(this._rotateSpeed, INITIAL_ROTATE_SPEED);
    }

    return this._controls.update(delta);
  }

  damage(damage) {
    if (this._hp <= 0 || damage <= 0 || !this._canDamage) {
      return false;
    }

    this._canDamage = false;

    this._hp -= damage;

    if (this._hp <= 0) {
      if (deathHandler) {
        deathHandler();
      }
      // Fire death event
    } else {
      console.log("Player is hit, remaining HP: " + this._hp);
      // Set a timeout to allow damage again after a cooldown
      setTimeout(() => {
        this._canDamage = true;
      }, DAMAGE_COOLDOWN);
    }
  }
}

let deathHandler;
document.addOnDeathHandler = function (handler) {
  deathHandler = handler;
};
