import * as C from 'graphics-ts/lib/Canvas'
import { spriteFramesWithIndex } from './Frames'
import { GameObject } from './GameObject'

export const initializeGameObject = (src: C.ImageSource): GameObject => ({
  sprite: {
    src,
    animationDelta: 0,
    frames: spriteFramesWithIndex(0),
    box: { x: 0, y: 0, width: 50, height: 56 },
  },
  animating: false,
  velocity: { x: 0, y: 0 },
})