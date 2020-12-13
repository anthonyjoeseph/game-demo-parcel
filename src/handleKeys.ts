import { Endomorphism, flow } from 'fp-ts/function'
import { pipe } from 'fp-ts/pipeable'
import * as M from 'fp-ts/Monoid'
import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import * as Z from 'fp-ts-contrib/Zipper'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as S from 'graphics-ts/lib/Shape'
import { VelocitySprite } from './lib/VelocitySprite'
import { MILLIS_PER_FRAME, spriteFramesWithIndex } from './constants'

const matchArrows = <A>(
  { left, down, right, up, }:
    { left: A, down: A, right: A, up: A, },
) => (
  defaultVal: A
) => (keycode: string) => {
  switch (keycode) {
    case 'ArrowLeft':
      return left
    case 'ArrowDown':
      return down
    case 'ArrowRight':
      return right
    case 'ArrowUp':
      return up
    default:
      return defaultVal
  }
}

const speedForKey = matchArrows<S.Point>({
  left: { x: -0.05, y: 0 },
  down: { x: 0, y: 0.03 },
  right: { x: 0.05, y: 0 },
  up: { x: 0, y: -0.03 },
})

const framesForKey = matchArrows({
  down: spriteFramesWithIndex(0),
  up: spriteFramesWithIndex(1),
  left: spriteFramesWithIndex(2),
  right: spriteFramesWithIndex(3),
})

const velocityMonoid = M.getStructMonoid<S.Point>({
  x: M.monoidSum,
  y: M.monoidSum,
})

const copyFocus = <A, B>(source: Z.Zipper<A>) => (
  dest: Z.Zipper<B>
) => pipe(
  Z.move(
    () => source.lefts.length,
    dest,
  ),
  O.getOrElse(() => dest),
)

export const handleKeys = (
  keycodes: string[]
): Endomorphism<VelocitySprite> => (sprite) => ({
  ...sprite,
  millisPerFrame: pipe(
    keycodes,
    O.fromPredicate(kc => kc.length > 0),
    O.map(() => MILLIS_PER_FRAME),
  ),
  frames: pipe(
    keycodes,
    NEA.fromArray,
    O.fold(
      () => Z.start(sprite.frames),
      flow(
        NEA.last,
        framesForKey(sprite.frames),
        copyFocus(sprite.frames),
      )
    ),
  ),
  pixelsPerMillis: pipe(
    keycodes,
    A.map(speedForKey(sprite.pixelsPerMillis)),
    M.fold(velocityMonoid),
  ),
})