import { pipe } from 'fp-ts/pipeable'
import * as O from 'fp-ts/Option'
import * as S from 'graphics-ts/lib/Shape'
import * as C from 'graphics-ts/lib/Canvas'
import * as R from 'fp-ts-contrib/lib/ReaderIO'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import { frameDeltaMillis$ } from './lib/Render'
import { toOffsetImage } from './lib/Sprite'
import { spriteImage } from './Image'
import { input } from './logic/Input'
import { pressedKeys$ } from './lib/Input'
import { draw } from './lib/OffsetImage'
import { GameObject, move, animate, windowBox$ } from './logic/GameObject'
import { initializeGameObject } from './logic/Initialize'

export const render$ = pipe(
  r.combineLatest([frameDeltaMillis$, pipe(OB.fromTask(spriteImage), OB.map(initializeGameObject))]),
  ro.withLatestFrom(pressedKeys$, windowBox$),
  ro.scan(
    (sprite: O.Option<GameObject>, [[delta, initialGameObject], keys, windowBox]) =>
      pipe(
        sprite,
        O.getOrElse(() => initialGameObject),
        input(keys),
        move(delta, windowBox),
        animate(delta),
        O.some,
      ),
    O.none,
  ),
  OB.compact,
  OB.map((gameObject) =>
    pipe(
      C.clearRect(S.rect(0, 0, window.screen.width, window.screen.height)),
      R.chain(() => draw(toOffsetImage(gameObject.sprite))),
    ),
  ),
)
