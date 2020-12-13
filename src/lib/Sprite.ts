import { pipe } from 'fp-ts/pipeable'
import { Endomorphism } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as Z from 'fp-ts-contrib/lib/Zipper'
import * as S from 'graphics-ts/lib/Shape'
import * as C from 'graphics-ts/lib/Canvas'

export interface Dimensions {
  readonly width: number
  readonly height: number
}

export interface SpriteFrame {
  offset: S.Point
  size: Dimensions
}
export interface Sprite {
  readonly src: C.ImageSource
  readonly scale: Dimensions
  readonly position: S.Point
  readonly frames: Z.Zipper<SpriteFrame>
  readonly millisPerFrame: O.Option<number>
  readonly delta: number
}

export const updateSprite = (
  deltaMillis: number
): Endomorphism<Sprite> => (sprite) => ({
  ...sprite,
  delta: pipe(
    sprite.millisPerFrame,
    O.chain(millisPerFrame => pipe(
      sprite.delta + deltaMillis,
      O.fromPredicate(newDelta => newDelta < millisPerFrame)
    )),
    O.getOrElse(() => 0)
  ),
  frames: pipe(
    sprite.millisPerFrame,
    O.chain(millisPerFrame => pipe(
      sprite.delta + deltaMillis,
      O.fromPredicate(newDelta => newDelta >= millisPerFrame)
    )),
    O.fold(
      () => sprite.frames,
      () => pipe(
        sprite.frames,
        Z.down,
        O.getOrElse(() => Z.start(sprite.frames))
      )
    ),
  ),
})

export const drawSprite = (sprite: Sprite) => 
  C.drawImageFull(
    sprite.src,
    Z.extract(sprite.frames).offset.x, 
    Z.extract(sprite.frames).offset.y,
    Z.extract(sprite.frames).size.width, 
    Z.extract(sprite.frames).size.height,
    sprite.position.x,
    sprite.position.y, 
    sprite.scale.width * Z.extract(sprite.frames).size.width,
    sprite.scale.height * Z.extract(sprite.frames).size.height
  )
