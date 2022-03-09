document.addEventListener("DOMContentLoaded", () => {
    var game = new Game();

    document.querySelector("#deal").addEventListener("click", () => game.deal());
    document.querySelector("#hit").addEventListener("click", () => game.hit());
    document.querySelector("#stand").addEventListener("click", () => game.stand());
    document.querySelector("#reset").addEventListener("click", () => game.reset());
})