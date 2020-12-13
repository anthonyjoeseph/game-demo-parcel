import { Endomorphism, flow } from 'fp-ts/function'
import { inputAnimation } from './inputAnimation'
import { inputMovement } from './inputMovement'
import { Sprite } from './Sprite'

export const input = (
  keycodes: string[]
): Endomorphism<Sprite> => flow(
  inputAnimation(keycodes),
  inputMovement(keycodes)
)