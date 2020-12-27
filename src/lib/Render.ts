import { pipe } from 'fp-ts/pipeable'
import { flow, Endomorphism, hole } from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import * as C from 'graphics-ts/lib/Canvas'
import * as R from 'fp-ts-contrib/lib/ReaderIO'
import { windowRect$ } from './Window'

export const frameDeltaMillis$ = pipe(
  r.animationFrames(),
  OB.map(({ elapsed }) => elapsed),
  ro.startWith(0),
  ro.pairwise(),
  OB.map(([prev, cur]) => cur - prev),
)

export const renderTo$ = <A>(
  canvasId: string,
  onCanvasNotFound: () => IO.IO<void>,
): ((ma: r.Observable<C.Render<A>>) => r.Observable<void>) =>
  OB.chain<C.Render<A>, void>(flow(C.renderTo(canvasId, onCanvasNotFound), OB.fromIO))

export const gameLoop$ = <S, A>(
  initialState: S,
  input: (state$: r.Observable<S>) => r.Observable<Endomorphism<S>>,
  render: (state: S) => C.Render<A>,
  canvasId: string,
  onCanvasNotFound: () => IO.IO<void>,
) => {
  const state$ = new r.BehaviorSubject<S>(initialState)
  return pipe(
    state$,
    input,
    ro.withLatestFrom(state$),
    OB.map(([modify, state]) => modify(state)),
    ro.tap((state) => state$.next(state)),
    ro.startWith(initialState),
    ro.observeOn(r.animationFrameScheduler),
    ro.withLatestFrom(windowRect$),
    OB.chain(
      ([state, windowRect]): r.Observable<void> =>
        pipe(
          C.clearRect(windowRect),
          R.chain(() => render(state)),
          C.renderTo(canvasId, onCanvasNotFound),
          OB.fromIO,
        ),
    ),
  )
}
