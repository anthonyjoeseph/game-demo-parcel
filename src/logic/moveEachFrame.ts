import { Endomorphism, pipe } from 'fp-ts/function'
import * as S from 'graphics-ts/lib/Shape'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import { GameObject, move } from './GameObject'
import { frameDeltaMillis$ } from 'game-ts/dist/Render'
import { windowRect$ } from 'game-ts/dist/Window'

export const moveEachFrame = (
  state$: r.Observable<GameObject>,
): r.Observable<Endomorphism<GameObject>> =>
  pipe(
    state$,
    ro.map((s) => !(s.velocity.x === 0 && s.velocity.y === 0)),
    ro.withLatestFrom(windowRect$),
    ro.distinctUntilChanged(),
    ro.switchMap(([moving, windowRect]) =>
      pipe(
        r.iif(() => moving, frameDeltaMillis$, r.EMPTY),
        ro.map((delta) => move(delta, windowRect)),
      ),
    ),
  )
