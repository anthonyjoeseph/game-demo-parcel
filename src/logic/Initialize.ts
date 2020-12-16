import * as C from 'graphics-ts/lib/Canvas'
import { rect } from 'graphics-ts/lib/Shape'
import { spriteFramesWithIndex } from './Frames'
import { GameObject } from './GameObject'

export const initializeGameObject = (src: C.ImageSource): GameObject => ({
  sprite: {
    src,
    animationDelta: 0,
    frames: spriteFramesWithIndex(0),
    rect: rect(0, 0, 50, 56),
  },
  animating: false,
  velocity: { x: 0, y: 0 },
})
