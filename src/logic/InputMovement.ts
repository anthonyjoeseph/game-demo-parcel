import { Endomorphism } from 'fp-ts/function'
import { pipe } from 'fp-ts/pipeable'
import * as M from 'fp-ts/Monoid'
import * as A from 'fp-ts/Array'
import * as S from 'graphics-ts/lib/Shape'
import { matchArrows } from './ArrowKeys'
import { GameObject } from './GameObject'

const speedForKey = matchArrows<S.Point>({
  left: { x: -0.5, y: 0 },
  down: { x: 0, y: 0.3 },
  right: { x: 0.5, y: 0 },
  up: { x: 0, y: -0.3 },
})

const velocityMonoid = M.getStructMonoid<S.Point>({
  x: M.monoidSum,
  y: M.monoidSum,
})

export const inputMovement = (keycodes: string[]): Endomorphism<GameObject> => (go) => ({
  ...go,
  velocity: pipe(keycodes, A.map(speedForKey(go.velocity)), M.fold(velocityMonoid)),
})
