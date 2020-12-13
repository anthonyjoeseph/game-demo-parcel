import { Endomorphism } from 'fp-ts/function'
import { pipe } from 'fp-ts/pipeable'
import * as M from 'fp-ts/Monoid'
import * as A from 'fp-ts/Array'
import F from 'flatten-js'
import { matchArrows } from './arrowKeys'
import { Sprite } from './Sprite'

const speedForKey = matchArrows<F.Point>({
  left: new F.Point(-0.05, 0),
  down: new F.Point(0, 0.03),
  right: new F.Point(0.05, 0),
  up: new F.Point(0, -0.03),
})

const velocityMonoid: M.Monoid<F.Point> = {
  concat: (left, right) =>
    new F.Point(left.x + right.x, left.y + right.y),
  empty: new F.Point(0, 0)
}

export const inputMovement = (
  keycodes: string[]
): Endomorphism<Sprite> => (sprite) => ({
  ...sprite,
  velocity: pipe(
    keycodes,
    A.map(speedForKey(sprite.velocity)),
    M.fold(velocityMonoid),
  ),
})