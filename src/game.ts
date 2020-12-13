import {pipe} from 'fp-ts/pipeable'
import * as O from 'fp-ts/Option'
import * as S from 'graphics-ts/lib/Shape'
import * as C from 'graphics-ts/lib/Canvas'
import * as R from 'fp-ts-contrib/lib/ReaderIO'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import { frameDeltaMillis$ } from './lib/Animation'
import { draw as drawSprite } from './lib/Sprite'
import { tick, VelocitySprite } from './lib/VelocitySprite'
import { spriteImage } from './image'
import { input } from './logic/input'
import { pressedKeys$ } from './lib/Input'
import { initializeSprite } from './logic/initialize'

export const render$ = pipe(
  r.combineLatest([
    frameDeltaMillis$,
    pipe(
      OB.fromTask(spriteImage),
      OB.map(initializeSprite),
    )
  ]),
  ro.withLatestFrom(pressedKeys$),
  ro.scan(
    (
      sprite: O.Option<VelocitySprite>, 
      [[delta, initialSprite], keys]
    ) => pipe(
      sprite,
      O.getOrElse(() => initialSprite),
      input(keys),
      tick(delta),
      O.some
    ),
    O.none,
  ),
  OB.compact,
  OB.map((sprite) => pipe(
    C.clearRect(S.rect(0, 0, window.screen.width, window.screen.height)),
    R.chain(() => drawSprite(sprite)),
  )),
)