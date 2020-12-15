import { pipe } from 'fp-ts/pipeable'
import { Endomorphism } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as Z from 'fp-ts-contrib/lib/Zipper'
import * as C from 'graphics-ts/lib/Canvas'
import { Box } from './Box'
import { OffsetImage } from './OffsetImage'

export interface SpriteFrame {
  box: Box
  duration: number
}

export interface Sprite {
  readonly src: C.ImageSource
  readonly box: Box
  readonly frames: Z.Zipper<SpriteFrame>
  readonly animationDelta: number
  readonly animating: boolean
}

export const animate = (deltaMillis: number): Endomorphism<Sprite> => (sprite) => ({
  ...sprite,
  animationDelta: pipe(
    sprite.animationDelta + deltaMillis,
    O.fromPredicate((newDelta) => sprite.animating && newDelta < Z.extract(sprite.frames).duration),
    O.getOrElse(() => 0),
  ),
  frames: pipe(
    sprite.animationDelta + deltaMillis,
    O.fromPredicate((newDelta) => sprite.animating && newDelta >= Z.extract(sprite.frames).duration),
    O.fold(
      () => sprite.frames,
      () =>
        pipe(
          sprite.frames,
          Z.down,
          O.getOrElse(() => Z.start(sprite.frames)),
        ),
    ),
  ),
})

export const toOffsetImage = (sprite: Sprite): OffsetImage => ({
  src: sprite.src,
  offset: Z.extract(sprite.frames).box,
  output: sprite.box,
})
