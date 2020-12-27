import { Endomorphism, pipe } from 'fp-ts/function'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import { GameObject, move } from './GameObject'
import { frameDeltaMillis$ } from '../lib/Render'
import { windowRect$ } from '../lib/Window'

export const moveEachFrame: r.Observable<Endomorphism<GameObject>> = pipe(
  frameDeltaMillis$,
  ro.observeOn(r.asyncScheduler),
  ro.withLatestFrom(windowRect$),
  ro.map(([delta, rect]) => move(delta, rect)),
)
