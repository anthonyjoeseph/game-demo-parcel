import { Endomorphism, pipe } from 'fp-ts/function'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as M from 'fp-ts/Monoid'
import * as A from 'fp-ts/Array'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as L from 'monocle-ts/lib/Lens'
import * as S from 'graphics-ts/lib/Shape'
import { GameObject } from './GameObject'
import { loopingAdvance } from '../lib/Sprite'
import { framesForKey } from './Frames'
import { matchArrows } from './ArrowKeys'

type ModifyState = Endomorphism<GameObject>

const speedForKey = matchArrows<S.Point>({
  left: { x: -0.15, y: 0 },
  down: { x: 0, y: 0.1 },
  right: { x: 0.15, y: 0 },
  up: { x: 0, y: -0.1 },
})

const velocityMonoid = M.getStructMonoid<S.Point>({
  x: M.monoidSum,
  y: M.monoidSum,
})

export const onKeys = (keys: NEA.NonEmptyArray<string>): r.Observable<ModifyState> =>
  pipe(
    r.interval(300),
    ro.mapTo(
      pipe(
        L.id<GameObject>(),
        L.prop('sprite'),
        L.prop('frames'),
        L.modify(loopingAdvance),
      ),
    ),
    ro.startWith(
      pipe(
        L.id<GameObject>(),
        L.props('sprite', 'velocity'),
        L.modify(({ sprite }) => ({
          sprite: {
            ...sprite,
            frames: framesForKey(sprite.frames)(NEA.last(keys)),
          },
          velocity: pipe(
            keys,
            A.map(speedForKey({ x: 0, y: 0 })),
            M.fold(velocityMonoid),
          ),
        })),
      ),
    ),
  )
