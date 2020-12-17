import * as Z from 'fp-ts-contrib/lib/Zipper'
import { rect } from 'graphics-ts/lib/Shape'
import { SpriteFrame } from '../lib/Sprite'
import { matchArrows } from './ArrowKeys'

export const MILLIS_PER_FRAME = 200

const frameForIndex = (x: number, y: number): SpriteFrame => ({
  rect: rect(16 * x, 18 * y, 16, 18),
  duration: MILLIS_PER_FRAME,
})
export const spriteFramesWithIndex = (index: number): Z.Zipper<SpriteFrame> =>
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
