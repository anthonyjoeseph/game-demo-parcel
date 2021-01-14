import * as r from 'rxjs'
import { flow } from 'fp-ts/function'
import { pipe } from 'fp-ts/pipeable'
import * as Eq from 'fp-ts/Eq'
import * as A from 'fp-ts/Array'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import { Key } from 'ts-key-enum'
import { windowRect$ } from 'game-ts/dist/Window'
import * as C from 'graphics-ts/lib/Canvas'
import { renderWithState$ } from 'game-ts/dist/Render'
import { initializeGameObject } from './logic/Initialize'
import { input } from './logic/Input'
import { draw } from './logic/Draw'

const canvasId = 'canvas'

r.merge(
  pipe(
    initializeGameObject,
    OB.fromTask,
    OB.compact,
    OB.chain((initialState) => renderWithState$(initialState, input, draw, canvasId)),
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
    OB.filter(
      flow(
        (e) => (e as KeyboardEvent).code as Key,
        (key) =>
          pipe(
            [Key.ArrowUp, Key.ArrowDown, Key.ArrowRight, Key.ArrowLeft],
            A.elem(Eq.eqString)(key),
          ),
      ),
    ),
    OB.map((e) => e.preventDefault()),
  ),
).subscribe()
