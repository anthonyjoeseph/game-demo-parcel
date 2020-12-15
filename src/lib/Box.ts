import * as Eq from 'fp-ts/Eq'
import { Predicate } from 'fp-ts/function'
import { pipe } from 'fp-ts/pipeable'
import * as IO from 'fp-ts/IO'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import { sequenceT } from 'fp-ts/lib/Apply'

export interface Box {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export const eqIntersect = Eq.fromEquals<Box>(
  (r1, r2) =>
    !(
      r2.x > r1.x + r1.width ||
      r1.x > r2.x + r2.width ||
      r2.y > r1.y + r1.height ||
      r1.y > r2.y + r2.height
    ),
)

export const eqOverlap = Eq.fromEquals<Box>(
  (r1, r2) =>
    !(
      r2.x >= r1.x + r1.width ||
      r1.x >= r2.x + r2.width ||
      r2.y >= r1.y + r1.height ||
      r1.y >= r2.y + r2.height
    ),
)

export const contains = (outer: Box): Predicate<Box> => (inner) =>
  outer.x <= inner.x &&
  outer.y <= inner.y &&
  outer.x + outer.width >= inner.x + inner.width &&
  outer.y + outer.height >= inner.y + inner.height

export const windowInnerWidth: IO.IO<number> = () => window.innerWidth

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

export const setHtmlElementBox = (
  element: HTMLElement & { width: number; height: number },
) => (box: Box): IO.IO<void> => () => {
  element.style.left = box.x + 'px'
  element.style.top = box.y + 'px'
  element.width = box.width
  element.height = box.height
}
