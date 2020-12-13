import * as S from 'graphics-ts/lib/Shape'
import * as C from 'graphics-ts/lib/Canvas'
import * as Z from 'fp-ts-contrib/lib/Zipper'
import { SpriteFrame, Dimensions } from './lib/Sprite'
import { VelocitySprite } from './lib/VelocitySprite'

export const MILLIS_PER_FRAME = 500

const frameDimension: Dimensions = {
  width: 16,
  height: 18,
}
const offsetForIndex = (index: number): S.Point => ({
  x: frameDimension.width * index,
  y: 0
})
const spriteFrames = Z.fromNonEmptyArray<SpriteFrame>([
  {offset: offsetForIndex(0), size: frameDimension},
  {offset: offsetForIndex(1), size: frameDimension},
  {offset: offsetForIndex(2), size: frameDimension}
])
export const initializeSprite = (src: C.ImageSource): VelocitySprite => ({
  src,
  delta: 0,
  frames: spriteFrames,
  millisPerFrame: MILLIS_PER_FRAME,
  position: {x: 0, y: 0},
  scale: {width: 1, height: 1},
  pixelsPerMillis: {
    x: 0,
    y: 0,
  }
})