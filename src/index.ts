import * as r from 'rxjs'
import { pipe } from 'fp-ts/pipeable'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import { Key } from 'ts-key-enum'
import { windowRect$ } from './lib/Window'
import * as C from 'graphics-ts/lib/Canvas'
import { error } from 'fp-ts/lib/Console'
import { gameLoop$ } from './lib/Render'
import { initializeGameObject } from './logic/Initialize'
import { input } from './logic/Input'
import { draw } from './logic/Draw'

const canvasId = 'canvas'

r.merge(
  pipe(
    initializeGameObject,
    OB.fromTask,
    OB.compact,
    OB.chain((initialState) =>
      gameLoop$(initialState, input, draw, canvasId, () => error('canvas not found')),
    ),
  ),
  pipe(
    C.getCanvasElementById(canvasId),
    OB.fromIO,
    OB.compact,
    OB.chain((canvasElem) =>
      pipe(
        windowRect$,
        OB.chain((windowRect) =>
          pipe(canvasElem, C.setDimensions(windowRect), OB.fromIO),
        ),
      ),
    ),
  ),
  // prevent arrow keys from scrolling the page
  pipe(
    r.fromEvent(window, 'keydown'),
    OB.map((e) => {
      const code = (e as KeyboardEvent).code
      if (
        code === Key.ArrowUp ||
        code === Key.ArrowDown ||
        code === Key.ArrowLeft ||
        code === Key.ArrowRight
      ) {
        e.preventDefault()
      }
    }),
  ),
).subscribe()
