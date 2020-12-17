import { pipe } from 'fp-ts/pipeable'
import { Endomorphism } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as Z from 'fp-ts-contrib/lib/Zipper'
import * as C from 'graphics-ts/lib/Canvas'
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

export const drawImageOffset = (src: C.ImageSource, offset: Rect, output: Rect) =>
  C.drawImageFull(
    src,
    offset.x,
    offset.y,
    offset.width,
    offset.height,
    output.x,
    output.y,
    output.width,
    output.height,
  )

export const drawSprite = (sprite: Sprite) =>
  drawImageOffset(sprite.src, Z.extract(sprite.frames).rect, sprite.rect)
