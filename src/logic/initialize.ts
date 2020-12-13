import * as C from 'graphics-ts/lib/Canvas'
import { VelocitySprite } from '../lib/VelocitySprite'
import { spriteFramesWithIndex } from "./frames"

export const initializeSprite = (src: C.ImageSource): VelocitySprite => ({
  src,
  animationDelta: 0,
  frames: spriteFramesWithIndex(0),
  position: {x: 0, y: 0},
  scale: {width: 1, height: 1},
  pixelsPerMillis: { x: 0, y: 0 },
  animating: false,
})