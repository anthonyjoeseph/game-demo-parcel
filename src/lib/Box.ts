import { Predicate } from 'fp-ts/function'

export interface Box {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export const intersect = (r1: Box): Predicate<Box> => (r2) =>
  !(r2.x > r1.x + r1.width || r1.x > r2.x + r2.width || r2.y > r1.y + r1.height || r1.y > r2.y + r2.height)

export const overlap = (r1: Box): Predicate<Box> => (r2) =>
  !(r2.x >= r1.x + r1.width || r1.x >= r2.x + r2.width || r2.y >= r1.y + r1.height || r1.y >= r2.y + r2.height)
