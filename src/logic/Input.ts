import { Endomorphism, flow } from 'fp-ts/function'
import { inputAnimation } from './InputAnimation'
import { inputMovement } from './InputMovement'
import { GameObject } from './GameObject'

export const input = (keycodes: string[]): Endomorphism<GameObject> =>
  flow(inputAnimation(keycodes), inputMovement(keycodes))
