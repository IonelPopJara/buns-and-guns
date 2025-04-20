const pauseMenu = document.getElementById("pause-menu");

let paused = true;
document.addEventListener("keyup", function (event) {
    if (event.keyCode == 27) {
        if (paused) {
            document.resume();
            pauseMenu.style.display = 'none';

            paused = false;
        } else {
            document.pause();
            pauseMenu.style.display = 'flex';

            paused = true;
        }
    }
}.bind(this))