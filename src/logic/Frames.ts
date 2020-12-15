import * as Z from 'fp-ts-contrib/lib/Zipper'
import { SpriteFrame } from '../lib/Sprite'
import { matchArrows } from './ArrowKeys'

export const MILLIS_PER_FRAME = 500

const frameForIndex = (x: number, y: number): SpriteFrame => ({
  box: { x: 16 * x, y: 18 * y, width: 16, height: 18 },
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
