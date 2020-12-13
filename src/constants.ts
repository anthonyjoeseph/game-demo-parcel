import * as O from 'fp-ts/Option'
import * as Z from 'fp-ts-contrib/lib/Zipper'
import * as S from 'graphics-ts/lib/Shape'
import * as C from 'graphics-ts/lib/Canvas'
import { SpriteFrame, Dimensions } from './lib/Sprite'
import { VelocitySprite } from './lib/VelocitySprite'

export const MILLIS_PER_FRAME = 500

const frameDimension: Dimensions = {
  width: 16,
  height: 18,
}
const offsetForIndex = (x: number, y: number): S.Point => ({
  x: frameDimension.width * x,
  y: frameDimension.height * y
})
export const spriteFramesWithIndex = (index: number) => 
  Z.fromNonEmptyArray<SpriteFrame>([
    {offset: offsetForIndex(0, index), size: frameDimension},
    {offset: offsetForIndex(1, index), size: frameDimension},
    {offset: offsetForIndex(0, index), size: frameDimension},
    {offset: offsetForIndex(2, index), size: frameDimension},
  ])
export const initializeSprite = (src: C.ImageSource): VelocitySprite => ({
  src,
  delta: 0,
  frames: spriteFramesWithIndex(0),
  millisPerFrame: O.none,
  position: {x: 0, y: 0},
  scale: {width: 1, height: 1},
  pixelsPerMillis: { x: 0, y: 0 }
})