export const windowInnerWidth: IO.IO<number> = () => window.innerWidth

import { pipe } from 'fp-ts/pipeable'
import { sequenceT } from 'fp-ts/Apply'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import * as IO from 'fp-ts/IO'
import { Box } from './Box'

export const windowInnerHeight: IO.IO<number> = () => window.innerHeight

export const windowBox$ = pipe(
  r.merge(r.fromEvent(window, 'load'), r.fromEvent(window, 'resize')),
  OB.chain(() => OB.fromIO(sequenceT(IO.io)(windowInnerWidth, windowInnerHeight))),
  ro.map(
    ([width, height]): Box => ({
      x: 0,
      y: 0,
      width,
      height,
    }),
  ),
)
