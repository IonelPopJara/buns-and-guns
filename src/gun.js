import { isPaused } from "./main";

const FRAMES = 7;
const FRAME_PATH = "./textures/gun/";
const FRAME_TIME = 42;

const MAX_DAMAGE = 10;
const FALLOFF_DISTANCE = 8;

export default class Gun {
  _image;
  _timeoutID;

  constructor(fireEventHandler) {
    this._image = document.createElement("img");

    this._image.setAttribute("class", "gun");
    this._image.src = FRAME_PATH + FRAMES + ".png";

    document.getElementById("ui").appendChild(this._image);
    document.addEventListener(
      "keyup",
      function (event) {
        if (isPaused()) {
          return;
        }

        if (event.key == " ") {
          this._animate();

          if (fireEventHandler) {
            fireEventHandler(this._calculateDamage);
          }
        }
      }.bind(this)
    );

    this._calculateDamage.bind(this);
  }

  _calculateDamage(distance) {
    if (distance > FALLOFF_DISTANCE || distance < 0 || FALLOFF_DISTANCE == 0) {
      return 0;
    }

    return Math.pow(1 - distance / FALLOFF_DISTANCE, 2) * MAX_DAMAGE;
  }

  _animate() {
    if (this._timeoutID) {
      clearTimeout(this._timeoutID);
    }

    let frame = 1;
    this._timeoutID = setTimeout(
      function changeFrame() {
        this._image.src = FRAME_PATH + frame++ + ".png";

        if (frame <= FRAMES) {
          this._timeoutID = setTimeout(changeFrame.bind(this), FRAME_TIME);
        }
      }.bind(this),
      FRAME_TIME
    );
  }
}
