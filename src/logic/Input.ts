import { Endomorphism, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import { GameObject } from './GameObject'
import { pressedKeys$ } from '../lib/Input'
import { onKeys } from './onKeys'
import { moveEachFrame } from './moveEachFrame'
import { onNoKeys } from './onNoKeys'

export const input = (
  state$: r.Observable<GameObject>,
): r.Observable<Endomorphism<GameObject>> =>
  r.merge(
    pipe(
      pressedKeys$,
      ro.switchMap((keys) => pipe(keys, NEA.fromArray, O.fold(onNoKeys, onKeys))),
    ),
    moveEachFrame,
  )
