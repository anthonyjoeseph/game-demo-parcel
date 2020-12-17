import { pipe } from 'fp-ts/pipeable'
import * as O from 'fp-ts/Option'
import * as C from 'graphics-ts/lib/Canvas'
import * as R from 'fp-ts-contrib/lib/ReaderIO'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import { frameDeltaMillis$ } from './lib/Render'
import { drawSprite } from './lib/Sprite'
import { spriteImage } from './Image'
import { input } from './logic/Input'
import { pressedKeys$ } from './lib/Input'
import { GameObject, move, animate } from './logic/GameObject'
import { initializeGameObject } from './logic/Initialize'
import { windowRect$ } from './lib/Window'

export const render$ = pipe(
  r.combineLatest([
    frameDeltaMillis$,
    pipe(OB.fromTask(spriteImage), OB.map(initializeGameObject)),
  ]),
  ro.withLatestFrom(pressedKeys$, windowRect$),
  ro.scan(
    (sprite: O.Option<GameObject>, [[delta, initialGameObject], keys, windowRect]) =>
      pipe(
        sprite,
        O.getOrElse(() => initialGameObject),
        input(keys),
        move(delta, windowRect),
        animate(delta),
        O.some,
      ),
    O.none,
  ),
  OB.compact,
  ro.withLatestFrom(windowRect$),
  OB.map(([gameObject, windowRect]) =>
    pipe(
      C.clearRect(windowRect),
      R.chain(() => drawSprite(gameObject.sprite)),
    ),
  ),
)
