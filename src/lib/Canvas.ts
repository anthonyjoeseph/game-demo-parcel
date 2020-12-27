import { pipe } from 'fp-ts/pipeable'
import { flow } from 'fp-ts/function'
import * as ro from 'rxjs/operators'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import * as C from 'graphics-ts/lib/Canvas'
import * as S from 'graphics-ts/lib/Shape'

export const canvasRect$ = (canvasId: string) =>
  pipe(
    C.getCanvasElementById(canvasId),
    OB.fromIO,
    OB.compact,
    OB.chain(flow(C.getDimensions, OB.fromIO)),
    ro.map((a) => S.rect(0, 0, a.width, a.height)),
  )
