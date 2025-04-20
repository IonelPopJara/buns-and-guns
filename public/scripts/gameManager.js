const pauseMenu = document.getElementById("pause-menu");
const deathScreen = document.getElementById("death-screen");
const homeScreen = document.getElementById("home-screen");
const endScreen = document.getElementById("end-screen");
const ui = document.getElementById("ui");

let paused = true;
let dead = false;

deathScreen.style.display = 'none';
pauseMenu.style.display = 'none';
ui.style.display = 'none';
endScreen.style.display = 'none';
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
    pauseMenu.style.display = 'none';
    ui.style.display = 'none';
    endScreen.style.display = 'none';
    homeScreen.style.display = 'none';

    dead = true;
})

document.addOnWinHandler(() => {
    document.pauseInternal();

    deathScreen.style.display = 'none';
    pauseMenu.style.display = 'none';
    ui.style.display = 'none';
    endScreen.style.display = 'flex';
    homeScreen.style.display = 'none';

    dead = true;
})

function pause() {
    document.pauseInternal();

    deathScreen.style.display = 'none';
    pauseMenu.style.display = 'flex';
    ui.style.display = 'none';
    endScreen.style.display = 'none';
    homeScreen.style.display = 'none';

    paused = true;
}

function resume() {
    if (!dead) {
        document.resumeInternal();

        deathScreen.style.display = 'none';
        pauseMenu.style.display = 'none';
        ui.style.display = 'flex';
        endScreen.style.display = 'none';
        homeScreen.style.display = 'none';

        paused = false;
    }
}