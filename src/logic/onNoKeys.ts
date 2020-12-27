import { Endomorphism, pipe } from 'fp-ts/function'
import * as Z from 'fp-ts-contrib/lib/Zipper'
import * as r from 'rxjs'
import * as L from 'monocle-ts/lib/Lens'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import { GameObject } from './GameObject'

export const onNoKeys = (): r.Observable<Endomorphism<GameObject>> =>
  pipe(
    L.id<GameObject>(),
    L.props('velocity', 'sprite'),
    L.modify(({ sprite }) => ({
      velocity: { x: 0, y: 0 },
      sprite: {
        ...sprite,
        frames: Z.start(sprite.frames),
      },
    })),
    OB.of,
  )
