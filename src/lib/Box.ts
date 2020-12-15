import * as Eq from 'fp-ts/Eq'
import { Predicate } from 'fp-ts/function'

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
