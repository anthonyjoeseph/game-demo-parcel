import { pipe } from 'fp-ts/pipeable'
import { Endomorphism } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as Z from 'fp-ts-contrib/lib/Zipper'
import * as C from 'graphics-ts/lib/Canvas'
import F from 'flatten-js'

export interface SpriteFrame {
  box: F.Box
  duration: number
}

export interface Sprite {
  readonly src: C.ImageSource
  readonly box: F.Box
  readonly frames: Z.Zipper<SpriteFrame>
  readonly animationDelta: number
  readonly animating: boolean
  readonly velocity: F.Point
}

export const animate = (
  deltaMillis: number
): Endomorphism<Sprite> => (sprite) => ({
  ...sprite,
  animationDelta: pipe(
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

export const move = (
  delta: number
): Endomorphism<Sprite> => (sprite) => ({
  ...sprite,
  box: new F.Box(
    sprite.box.xmin + (delta * sprite.velocity.x),
    sprite.box.ymin + (delta * sprite.velocity.y),
  ),
})

export const draw = (sprite: Sprite) => 
  {
    console.log(Z.extract(sprite.frames).box.xmax - Z.extract(sprite.frames).box.xmin)
    return C.drawImageFull(
      sprite.src,
      Z.extract(sprite.frames).box.xmin,
      Z.extract(sprite.frames).box.ymin,
      Z.extract(sprite.frames).box.xmax - Z.extract(sprite.frames).box.xmin, 
      Z.extract(sprite.frames).box.ymax - Z.extract(sprite.frames).box.ymin,
      sprite.box.xmin,
      sprite.box.ymin, 
      sprite.box.xmax - sprite.box.xmin,
      sprite.box.ymax - sprite.box.ymin
    )
  }
