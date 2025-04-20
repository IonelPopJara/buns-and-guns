const pauseMenu = document.getElementById("pause-menu");
const deathScreen = document.getElementById("death-screen");
const homeScreen = document.getElementById("home-screen");
const ui = document.getElementById("ui");

let paused = true;
let dead = false;

deathScreen.style.display = 'none';
pauseMenu.style.display = 'none';
ui.style.display = 'none';
homeScreen.style.display = 'flex';

document.addEventListener("keyup", function (event) {
    if (!dead && event.key == "p") {
        if (paused) {
            resume();
        } else {
            pause();
        }
    }
})

document.addOnDeathHandler(() => {
    document.pauseInternal();
    deathScreen.style.display = 'flex';
    ui.style.display = 'none';

    dead = true;
})

function pause() {
    document.pauseInternal();
    pauseMenu.style.display = 'flex';
    ui.style.display = 'none';

    paused = true;
}

function resume() {
    if (!dead) {
        document.resumeInternal();
        pauseMenu.style.display = 'none';
        homeScreen.style.display = 'none';
        ui.style.display = 'flex';

        paused = false;
    }
}