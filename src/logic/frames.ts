import * as Z from 'fp-ts-contrib/lib/Zipper'
import F from 'flatten-js'
import { SpriteFrame } from './Sprite'
import { matchArrows } from './arrowKeys'

export const MILLIS_PER_FRAME = 500

const frameForIndex = (x: number, y: number): SpriteFrame => ({
  box: new F.Box(16 * x, 18 * y, 16 * (x + 1), 18 * (y + 1)),
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