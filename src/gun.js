const PATH = "./src/assets/gun/";
const FRAMES = 7;
const TIMEOUT = 42;

export default class Gun {
    _image;
    _timeoutID;

    constructor() {
        this._image = document.createElement('img');

        this._image.setAttribute('class', 'gun');
        this._image.src = PATH + FRAMES + '.png';

        document.getElementById("ui").appendChild(this._image)
        document.addEventListener("keyup", function (event) {
            if (event.key == " ") {
                console.log("Shoot!")

                this._animate()
            }
        }.bind(this))
    }

    _animate() {
        if (this._timeoutID) {
            clearTimeout(this._timeoutID);
        }

        let frame = 1;
        this._timeoutID = setTimeout(function changeFrame() {
            this._image.src = PATH + (frame++) + '.png';

            if (frame <= FRAMES) {
                this._timeoutID = setTimeout(changeFrame.bind(this), TIMEOUT)
            }
        }.bind(this), TIMEOUT);
    }
}