import { Endomorphism, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as L from 'monocle-ts/lib/Lens'
import * as S from 'graphics-ts/lib/Shape'
import { Rect } from 'graphics-ts/lib/Shape'
import { contains } from '../lib/Collision'
import { Sprite } from '../lib/Sprite'

export interface GameObject {
  readonly sprite: Sprite
  readonly velocity: S.Point
  readonly animating: boolean
}

export const move = (delta: number, windowRect: Rect): Endomorphism<GameObject> =>
  pipe(
    L.id<GameObject>(),
    L.props('sprite', 'velocity'),
    L.modify(({ velocity, sprite }) => ({
      velocity,
      sprite: {
        ...sprite,
        rect: pipe(
          {
            ...sprite.rect,
            x: sprite.rect.x + delta * velocity.x,
            y: sprite.rect.y + delta * velocity.y,
          },
          O.fromPredicate(contains(windowRect)),
          O.getOrElse(() => sprite.rect),
        ),
      },
    })),
  )
