import { Endomorphism, flow } from 'fp-ts/function'
import { VelocitySprite } from '../lib/VelocitySprite'
import { inputAnimation } from './inputAnimation'
import { inputMovement } from './inputMovement'

export const input = (
  keycodes: string[]
): Endomorphism<VelocitySprite> => flow(
  inputAnimation(keycodes),
  inputMovement(keycodes)
)