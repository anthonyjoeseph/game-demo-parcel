import * as Z from 'fp-ts-contrib/lib/Zipper'
import { SpriteFrame, Dimensions } from '../lib/Sprite'
import { matchArrows } from './arrowKeys'

export const MILLIS_PER_FRAME = 500

const frameDimension: Dimensions = {
  width: 16,
  height: 18,
}
const frameForIndex = (x: number, y: number): SpriteFrame => ({
  offset: {
    x: frameDimension.width * x,
    y: frameDimension.height * y
  },
  size: frameDimension,
  duration: MILLIS_PER_FRAME
})
export const spriteFramesWithIndex = (index: number) => 
  Z.fromNonEmptyArray<SpriteFrame>([
    frameForIndex(0, index),
    frameForIndex(1, index),
    frameForIndex(0, index),
    frameForIndex(2, index),
  ])
export const framesForKey = matchArrows({
  down: spriteFramesWithIndex(0),
  up: spriteFramesWithIndex(1),
  left: spriteFramesWithIndex(2),
  right: spriteFramesWithIndex(3),
})