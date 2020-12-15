import * as C from 'graphics-ts/lib/Canvas'
import { Sprite } from '../lib/Sprite'
import { spriteFramesWithIndex } from './frames'

export const initializeSprite = (src: C.ImageSource): Sprite => ({
  src,
  animationDelta: 0,
  frames: spriteFramesWithIndex(0),
  velocity: { x: 0, y: 0 },
  animating: false,
  box: { x: 0, y: 0, width: 16, height: 18 },
})
