import * as C from 'graphics-ts/lib/Canvas'
import { spriteFramesWithIndex } from './Frames'
import { GameObject } from './GameObject'

export const initializeGameObject = (src: C.ImageSource): GameObject => ({
  sprite: {
    src,
    animationDelta: 0,
    frames: spriteFramesWithIndex(0),
    animating: false,
    box: { x: 0, y: 0, width: 16, height: 18 },
  },
  velocity: { x: 0, y: 0 },
})
