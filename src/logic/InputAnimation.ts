import { Endomorphism, flow } from 'fp-ts/function'
import { pipe } from 'fp-ts/pipeable'
import * as O from 'fp-ts/Option'
import * as Z from 'fp-ts-contrib/Zipper'
import * as NEA from 'fp-ts/NonEmptyArray'
import { framesForKey } from './Frames'
import { GameObject } from './GameObject'

const copyFocus = <A, B>(source: Z.Zipper<A>) => (dest: Z.Zipper<B>) =>
  pipe(
    Z.move(() => source.lefts.length, dest),
    O.getOrElse(() => dest),
  )

export const inputAnimation = (keycodes: string[]): Endomorphism<GameObject> => (go) => ({
  ...go,
  animating: keycodes.length > 0,
  sprite: {
    ...go.sprite,
    frames: pipe(
      keycodes,
      NEA.fromArray,
      O.fold(
        () => Z.start(go.sprite.frames),
        flow(NEA.last, framesForKey(go.sprite.frames), copyFocus(go.sprite.frames)),
      ),
    ),
  },
})
