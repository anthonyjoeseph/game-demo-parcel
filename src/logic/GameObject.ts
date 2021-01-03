import { Endomorphism, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as Z from 'fp-ts-contrib/Zipper'
import * as L from 'monocle-ts/lib/Lens'
import * as S from 'graphics-ts/lib/Shape'
import * as C from 'graphics-ts/lib/Canvas'
import * as G from 'geometric'
import { toVerticies } from 'game-ts/dist/Geometry'
import { WalkingFrames } from './Frames'

export interface GameObject {
  readonly src: C.ImageSource
  readonly rect: S.Rect
  readonly currentFrames: Z.Zipper<S.Rect>
  readonly walkingFrames: WalkingFrames
  readonly velocity: S.Point
}

export const move = (delta: number, windowRect: S.Rect): Endomorphism<GameObject> =>
  pipe(
    L.id<GameObject>(),
    L.props('rect', 'velocity'),
    L.modify(({ velocity, rect }) => ({
      velocity,
      rect: pipe(
        {
          ...rect,
          x: rect.x + delta * velocity.x,
          y: rect.y + delta * velocity.y,
        },
        O.fromPredicate((spriteRect) =>
          G.polygonInPolygon(toVerticies(spriteRect), toVerticies(windowRect)),
        ),
        O.getOrElse(() => rect),
      ),
    })),
  )
