import { error } from "fp-ts/Console";
import { render$ } from "./game";
import { renderTo$ } from "./lib/Animation";

const gameLoop = renderTo$('canvas', () => error('canvas not found'))(render$)
gameLoop.subscribe()

// can't figure out a better way to do this
const fullscreenCanvas = document.getElementById('canvas')
if (fullscreenCanvas) {
  fullscreenCanvas.style.width = window.innerWidth + "px";
  fullscreenCanvas.style.height = window.innerHeight - 20 + "px";
}