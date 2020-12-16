import { pipe } from 'fp-ts/pipeable'
import { Endomorphism } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as Z from 'fp-ts-contrib/lib/Zipper'
import * as C from 'graphics-ts/lib/Canvas'
import { OffsetImage } from './OffsetImage'
import { Rect } from 'graphics-ts/lib/Shape'

export interface SpriteFrame {
  rect: Rect
  duration: number
}

export interface Sprite {
  readonly src: C.ImageSource
  readonly rect: Rect
  readonly frames: Z.Zipper<SpriteFrame>
  readonly animationDelta: number
}

export const animate = (deltaMillis: number): Endomorphism<Sprite> => (sprite) => ({
  ...sprite,
  animationDelta: pipe(
    sprite.animationDelta + deltaMillis,
    O.fromPredicate((newDelta) => newDelta < Z.extract(sprite.frames).duration),
    O.getOrElse(() => 0),
  ),
  frames: pipe(
    sprite.animationDelta + deltaMillis,
    O.fromPredicate((newDelta) => newDelta >= Z.extract(sprite.frames).duration),
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
  offset: Z.extract(sprite.frames).rect,
  output: sprite.rect,
})
