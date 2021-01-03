import { Endomorphism, flow, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import { GameObject } from './GameObject'
import { pressedKeys$ } from 'game-ts/dist/Input'
import { startWalking } from './startWalking'
import { moveEachFrame } from './moveEachFrame'
import { stopWalking } from './stopWalking'

export const input = (
  state$: r.Observable<GameObject>,
): r.Observable<Endomorphism<GameObject>> =>
  r.merge(
    pipe(
      pressedKeys$,
      ro.switchMap(
        flow(
          NEA.fromArray,
          O.fold(() => stopWalking, startWalking),
        ),
      ),
    ),
    moveEachFrame,
  )
