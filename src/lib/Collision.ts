import * as Eq from 'fp-ts/Eq'
import { pipe, Predicate } from 'fp-ts/function'
import { Rect } from 'graphics-ts/lib/Shape'
import * as RA from 'fp-ts/ReadonlyArray'

export const eqIntersect = Eq.fromEquals<Rect>(
  (r1, r2) =>
    !(
      r2.x > r1.x + r1.width ||
      r1.x > r2.x + r2.width ||
      r2.y > r1.y + r1.height ||
      r1.y > r2.y + r2.height
    ),
)

export const eqOverlap = Eq.fromEquals<Rect>(
  (r1, r2) =>
    !(
      r2.x >= r1.x + r1.width ||
      r1.x >= r2.x + r2.width ||
      r2.y >= r1.y + r1.height ||
      r1.y >= r2.y + r2.height
    ),
)

export const contains = (outer: Rect): Predicate<Rect> => (inner) =>
  outer.x <= inner.x &&
  outer.y <= inner.y &&
  outer.x + outer.width >= inner.x + inner.width &&
  outer.y + outer.height >= inner.y + inner.height

export const collisionsRO = <A>(eq: Eq.Eq<A>) => (as: readonly A[]): readonly [A, A][] =>
  pipe(
    as,
    RA.chainWithIndex((index, a) =>
      pipe(
        as,
        RA.dropLeft(index + 1),
        RA.filter<A>((b) => eq.equals(a, b)),
        RA.map((c): [A, A] => [a, c]),
      ),
    ),
  )

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const collisions: <A>(eq: Eq.Eq<A>) => (as: A[]) => [A, A][] = collisionsRO as any
