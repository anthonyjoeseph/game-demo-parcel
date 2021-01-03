import * as Z from 'fp-ts-contrib/Zipper'
import { drawImageOffset } from 'game-ts/dist/Image'
import { GameObject } from './GameObject'

export const draw = (state: GameObject) =>
  drawImageOffset(state.src, Z.extract(state.currentFrames), state.rect)
