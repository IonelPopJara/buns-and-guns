import * as THREE from "three";
import CameraControls from "camera-controls";
import * as HoldEvent from "https://unpkg.com/hold-event@0.2.0/dist/hold-event.module.js";
import { Collider, Direction } from "./collider";
import Gun from "./gun";

const HOLD_DURATION = 16.666;
const AIM_SENSITIVITY = 0.13;
const MOVE_SENSITIVITY = 0.01;
const MOVE_SIDE_SENSITIVITY = 0.005;
const KEYCODE = {
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
};

const ROTATE_ACCELERATION = 0.001;
const ROTATE_DECELERATION = 2;
const MAX_ROTATE_SPEED = 1.2;
const INITIAL_ROTATE_SPEED = 0.5;

let rotateSpeed = 0.1;
let isRotating = false;

let movementVector = {
  up: 0,
  down: 0,
  left: 0,
  right: 0,
};

export default class Player {
  _controls;
  _collider;
  _gun;

  constructor(cameraWrapper, scene) {
    CameraControls.install({ THREE: THREE });

    this._controls = new CameraControls(
      cameraWrapper.camera,
      cameraWrapper.renderer.domElement
    );
    this._collider = new Collider(cameraWrapper.camera, scene);
    this._gun = new Gun();

    // WASD block
    new HoldEvent.KeyboardKeyHold(KEYCODE.W, HOLD_DURATION).addEventListener(
      "holding",
      function (event) {
        movementVector.up = 1;
        // this._controls.forward(
        //   Math.min(
        //     MOVE_SENSITIVITY * event.deltaTime,
        //     this._collider.getAllowedTravelDistance(Direction.FORWARD)
        //   ),
        //   false
        // );
      }.bind(this)
    );
    new HoldEvent.KeyboardKeyHold(KEYCODE.A, HOLD_DURATION).addEventListener(
      "holding",
      function (event) {
        movementVector.left = -1;
        // this._controls.truck(
        //   -Math.min(
        //     MOVE_SIDE_SENSITIVITY * event.deltaTime,
        //     this._collider.getAllowedTravelDistance(Direction.LEFT)
        //   ),
        //   0,
        //   false
        // );
      }.bind(this)
    );
    new HoldEvent.KeyboardKeyHold(KEYCODE.S, HOLD_DURATION).addEventListener(
      "holding",
      function (event) {
        movementVector.down = -1;
        // this._controls.forward(
        //   -Math.min(
        //     MOVE_SENSITIVITY * event.deltaTime,
        //     this._collider.getAllowedTravelDistance(Direction.BACKWARD)
        //   ),
        //   false
        // );
      }.bind(this)
    );
    new HoldEvent.KeyboardKeyHold(KEYCODE.D, HOLD_DURATION).addEventListener(
      "holding",
      function (event) {
        movementVector.right = 1;
        // this._controls.truck(
        //   Math.min(
        //     MOVE_SIDE_SENSITIVITY * event.deltaTime,
        //     this._collider.getAllowedTravelDistance(Direction.RIGHT)
        //   ),
        //   0,
        //   false
        // );
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
        isRotating = true;
        this._controls.rotate(
          AIM_SENSITIVITY *
            THREE.MathUtils.DEG2RAD *
            event.deltaTime *
            rotateSpeed,
          0,
          false
        );

        rotateSpeed +=
          ROTATE_ACCELERATION *
          event.deltaTime *
          (MAX_ROTATE_SPEED - rotateSpeed);
        rotateSpeed = Math.min(rotateSpeed, MAX_ROTATE_SPEED);
      }.bind(this)
    );

    arrowLeft.addEventListener(
      "holdEnd",
      function (event) {
        console.log("release");
        isRotating = false;
      }.bind(this)
    );

    const arrowRight = new HoldEvent.KeyboardKeyHold(
      KEYCODE.ARROW_RIGHT,
      HOLD_DURATION
    );

    arrowRight.addEventListener(
      "holding",
      function (event) {
        isRotating = true;
        this._controls.rotate(
          -AIM_SENSITIVITY *
            THREE.MathUtils.DEG2RAD *
            event.deltaTime *
            rotateSpeed,
          0,
          false
        );

        rotateSpeed +=
          ROTATE_ACCELERATION *
          event.deltaTime *
          (MAX_ROTATE_SPEED - rotateSpeed);
        rotateSpeed = Math.min(rotateSpeed, MAX_ROTATE_SPEED);
      }.bind(this)
    );

    arrowRight.addEventListener(
      "holdEnd",
      function (event) {
        console.log("release");
        isRotating = false;
      }.bind(this)
    );
  }

  update(delta) {
    const movementDirection = new THREE.Vector2(
      movementVector.right + movementVector.left,
      movementVector.up + movementVector.down
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
    } else if (movementDirection.y < 0) {
      this._controls.forward(
        -Math.min(
          MOVE_SENSITIVITY * delta * Math.abs(movementDirection.y) * 1000,
          this._collider.getAllowedTravelDistance(Direction.BACKWARD)
        ),
        false
      );
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
    } else if (movementDirection.x < 0) {
      this._controls.truck(
        -Math.min(
          MOVE_SIDE_SENSITIVITY * delta * Math.abs(movementDirection.x) * 1000,
          this._collider.getAllowedTravelDistance(Direction.LEFT)
        ),
        0,
        false
      );
    }

    // Reset movement vector
    movementVector = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
    };

    if (!isRotating) {
      rotateSpeed -= ROTATE_DECELERATION * delta;
      rotateSpeed = Math.max(rotateSpeed, INITIAL_ROTATE_SPEED);
    }
    return this._controls.update(delta);
  }
}
