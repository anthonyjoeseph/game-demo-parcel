import {pipe} from 'fp-ts/pipeable'
import { error } from 'fp-ts/lib/Console'
import * as RA from 'fp-ts/lib/ReadonlyArray'
import * as C from 'graphics-ts/lib/Canvas'
import * as Color from 'graphics-ts/lib/Color'
import * as D from 'graphics-ts/lib/Drawing'
import * as S from 'graphics-ts/lib/Shape'

import {now} from 'fp-ts/Date'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import {flow} from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
import { frameDeltaMillis$, renderTo$ } from './utils'

const PIXELS_PER_MILLIS = 0.007

const canvasId = 'canvas'

const render$ = pipe(
  frameDeltaMillis$,
  ro.scan((offset, deltaMillis) => offset + (deltaMillis * PIXELS_PER_MILLIS), 0),
  ro.map(offset => {
    const triangle: C.Render<void> = D.render(
      D.fill(
        S.path(RA.readonlyArray)([
          S.point(75 + offset, 50),
          S.point(100 + offset, 75),
          S.point(100 + offset, 25)
        ]),
        D.fillStyle(Color.black)
      )
    )
    return triangle
  })
)

const gameLoop = renderTo$('canvas', () => error('canvas not found'))(render$)
gameLoop.subscribe()