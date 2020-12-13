import * as C from 'graphics-ts/lib/Canvas'
import F from 'flatten-js'
import { Sprite } from './Sprite'
import { spriteFramesWithIndex } from "./frames"

export const initializeSprite = (src: C.ImageSource): Sprite => ({
  src,
  animationDelta: 0,
  frames: spriteFramesWithIndex(0),
  velocity: new F.Point(0, 0),
  animating: false,
  box: new F.Box(0, 0, 16, 18),
})