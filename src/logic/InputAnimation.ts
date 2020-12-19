import { Endomorphism, flow } from 'fp-ts/function'
import { pipe } from 'fp-ts/pipeable'
import * as O from 'fp-ts/Option'
import * as Z from 'fp-ts-contrib/Zipper'
import * as L from 'monocle-ts/lib/Lens'
import * as NEA from 'fp-ts/NonEmptyArray'
import { framesForKey } from './Frames'
import { GameObject } from './GameObject'

const copyFocus = <A, B>(source: Z.Zipper<A>) => (dest: Z.Zipper<B>) =>
  pipe(
    Z.move(() => source.lefts.length, dest),
    O.getOrElse(() => dest),
  )

export const inputAnimation = (keycodes: string[]): Endomorphism<GameObject> =>
  pipe(
    L.id<GameObject>(),
    L.props('animating', 'sprite'),
    L.modify(({ sprite }) => ({
      animating: keycodes.length > 0,
      sprite: {
        ...sprite,
        frames: pipe(
          keycodes,
          NEA.fromArray,
          O.fold(
            () => Z.start(sprite.frames),
            flow(NEA.last, framesForKey(sprite.frames), copyFocus(sprite.frames)),
          ),
        ),
      },
    })),
  )
