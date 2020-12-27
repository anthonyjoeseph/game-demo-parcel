import * as r from 'rxjs'
import { pipe } from 'fp-ts/pipeable'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import { Key } from 'ts-key-enum'
import { windowRect$ } from './lib/Window'
import { setDimensions } from 'graphics-ts/lib/Canvas'
import { error } from 'fp-ts/lib/Console'
import { gameLoop$ } from './lib/Render'
import { initializeGameObject } from './logic/Initialize'
import greenCap from './greenCap.png'
import { input } from './logic/Input'
import { draw } from './logic/Draw'

const imgg = new Image()
imgg.src = greenCap
imgg.onload = () => {
  const initialState = initializeGameObject(imgg)
  const gameLoop = gameLoop$(initialState, input, draw, 'canvas', () =>
    error('canvas not found'),
  )
  gameLoop.subscribe()
}

// prevent arrow keys from scrolling the page
r.fromEvent(window, 'keydown').subscribe((e) => {
  const code = (e as KeyboardEvent).code
  if (
    code === Key.ArrowUp ||
    code === Key.ArrowDown ||
    code === Key.ArrowLeft ||
    code === Key.ArrowRight
  ) {
    e.preventDefault()
  }
})

const canvas = document.getElementById('canvas') as HTMLCanvasElement | null
if (canvas) {
  pipe(
    windowRect$,
    OB.chain((rect) => pipe(canvas, setDimensions(rect), OB.fromIO)),
    (obs) => obs.subscribe(),
  )
}
