import * as THREE from "three";
import CameraControls from "camera-controls";
import * as holdEvent from "https://unpkg.com/hold-event@0.2.0/dist/hold-event.module.js";

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

export default class Controller {
  _controls;

  constructor(camera, renderer) {
    CameraControls.install({ THREE: THREE });
    this._controls = new CameraControls(camera, renderer.domElement);

    // WASD block
    new holdEvent.KeyboardKeyHold(KEYCODE.W, HOLD_DURATION).addEventListener(
      "holding",
      function (event) {
        this._controls.forward(MOVE_SENSITIVITY * event.deltaTime, false);
      }.bind(this)
    );
    new holdEvent.KeyboardKeyHold(KEYCODE.A, HOLD_DURATION).addEventListener(
      "holding",
      function (event) {
        this._controls.truck(-MOVE_SIDE_SENSITIVITY * event.deltaTime, 0, false);
      }.bind(this)
    );
    new holdEvent.KeyboardKeyHold(KEYCODE.S, HOLD_DURATION).addEventListener(
      "holding",
      function (event) {
        this._controls.forward(-MOVE_SENSITIVITY * event.deltaTime, false);
      }.bind(this)
    );
    new holdEvent.KeyboardKeyHold(KEYCODE.D, HOLD_DURATION).addEventListener(
      "holding",
      function (event) {
        this._controls.truck(MOVE_SIDE_SENSITIVITY * event.deltaTime, 0, false);
      }.bind(this)
    );

    // Arrows block
    new holdEvent.KeyboardKeyHold(
      KEYCODE.ARROW_LEFT,
      HOLD_DURATION
    ).addEventListener("holding", function (event) {
      this._controls.rotate(
        AIM_SENSITIVITY * THREE.MathUtils.DEG2RAD * event.deltaTime,
        0,
        false
      );
    }.bind(this)
    );
    new holdEvent.KeyboardKeyHold(
      KEYCODE.ARROW_RIGHT,
      HOLD_DURATION
    ).addEventListener("holding", function (event) {
      this._controls.rotate(
        -AIM_SENSITIVITY * THREE.MathUtils.DEG2RAD * event.deltaTime,
        0,
        false
      );
    }.bind(this)
    );
  }

  update(delta) {
    return this._controls.update(delta);
  }
}
