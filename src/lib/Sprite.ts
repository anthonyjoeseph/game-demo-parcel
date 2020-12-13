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
  duration: number
}

export interface Sprite {
  readonly src: C.ImageSource
  readonly scale: Dimensions
  readonly position: S.Point
  readonly frames: Z.Zipper<SpriteFrame>
  readonly animationDelta: number
  readonly animating: boolean
}

export const tick = (
  deltaMillis: number
): Endomorphism<Sprite> => (sprite) => ({
  ...sprite,
  delta: pipe(
    sprite.animationDelta + deltaMillis,
    O.fromPredicate(newDelta => newDelta < Z.extract(sprite.frames).duration),
    O.getOrElse(() => 0)
  ),
  frames: pipe(
    sprite.animationDelta + deltaMillis,
    O.fromPredicate(newDelta => newDelta >= Z.extract(sprite.frames).duration),
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

export const draw = (sprite: Sprite) => 
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
