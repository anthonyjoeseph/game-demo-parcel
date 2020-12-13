import { Endomorphism } from 'fp-ts/function'
import { pipe } from 'fp-ts/pipeable'
import * as M from 'fp-ts/Monoid'
import * as A from 'fp-ts/Array'
import * as S from 'graphics-ts/lib/Shape'
import { VelocitySprite } from './lib/VelocitySprite'
import { Key } from 'ts-key-enum'

const switchKey = (pixelsPerSec: S.Point) => (
  keycode: Key
): S.Point => {
  switch (keycode) {
    case Key.ArrowUp:
      return { x: 0, y: -0.05 }
    case Key.ArrowDown:
      return { x: 0, y: 0.05 }
    case Key.ArrowLeft:
      return { x: -0.05, y: 0 }
    case Key.ArrowRight:
      return { x: 0.05, y: 0 }
    default:
      return pixelsPerSec
  }
}

const velocityMonoid = M.getStructMonoid<S.Point>({
  x: M.monoidSum,
  y: M.monoidSum,
})

export const handleKeys = (
  keycodes: Key[]
): Endomorphism<VelocitySprite> => (animation) => {
  const pixelsPerSec = pipe(
    keycodes,
    A.map(switchKey(animation.pixelsPerMillis)),
    M.fold(velocityMonoid),
  )
  return ({
    ...animation,
    pixelsPerMillis: pixelsPerSec,
  })
}