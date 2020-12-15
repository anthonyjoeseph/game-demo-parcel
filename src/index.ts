import { error } from 'fp-ts/Console'
import { pipe } from 'fp-ts/pipeable'
import { render$ } from './game'
import { renderTo$ } from './lib/Render'

const gameLoop = pipe(
  render$,
  renderTo$('canvas', () => error('canvas not found')),
)
gameLoop.subscribe()

// can't figure out a better way to do this
const fullscreenCanvas = document.getElementById('canvas')
if (fullscreenCanvas) {
  fullscreenCanvas.style.width = window.innerWidth + 'px'
  fullscreenCanvas.style.height = window.innerHeight - 20 + 'px'
}
