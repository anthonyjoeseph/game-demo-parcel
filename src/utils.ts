import {pipe} from 'fp-ts/pipeable'
import * as C from 'graphics-ts/lib/Canvas'

import {now} from 'fp-ts/Date'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import {flow} from 'fp-ts/function'
import * as IO from 'fp-ts/IO'

export const frameDeltaMillis$ = pipe(
  r.timer(0, 0, r.animationFrameScheduler),
  OB.chain(() => OB.fromIO(now)),
  ro.pairwise(),
  OB.map(([prevTime, currentTime]) => currentTime - prevTime),
)

export const renderTo$ = (
  canvasId: string,
  onCanvasNotFound: () => IO.IO<void>
) => OB.chain(flow(C.renderTo(canvasId, onCanvasNotFound), OB.fromIO))