import { pipe } from 'fp-ts/pipeable'
import * as Ord from 'fp-ts/Ord'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as R from 'fp-ts/Record'
import * as Z from 'fp-ts-contrib/Zipper'
import { contains } from 'fp-ts-std/String'
import * as S from 'graphics-ts/lib/Shape'
import { FrameRecord, toGraphicsRect } from 'game-ts/dist/Spritesheet'
import { getLastSemigroup } from 'fp-ts/lib/Semigroup'

export const MILLIS_PER_FRAME = 200

export interface WalkingFrames {
  left: Z.Zipper<S.Rect>
  right: Z.Zipper<S.Rect>
  down: Z.Zipper<S.Rect>
  up: Z.Zipper<S.Rect>
}

const parseWalkingFrameDirection = (direction: string) => (frameRecord: FrameRecord) =>
  pipe(
    frameRecord.frames,
    R.filterWithIndex(contains(direction)),
    R.toArray,
    A.sort(
      pipe(
        Ord.ordString,
        Ord.contramap(([filenameKey]: [string, unknown]): string => filenameKey),
      ),
    ),
    A.map(([, frameVal]) => frameVal.frame),
    A.map(toGraphicsRect),
    NEA.fromArray,
  )
export const parseWalkingFrames = (frameRecord: FrameRecord): O.Option<WalkingFrames> =>
  pipe(
    R.fromFoldableMap(
      getLastSemigroup<O.Option<RNEA.ReadonlyNonEmptyArray<S.Rect>>>(),
      A.array,
    )(['left', 'right', 'up', 'down'], (direction: keyof WalkingFrames) => [
      direction,
      parseWalkingFrameDirection(direction)(frameRecord),
    ]),
    R.sequence(O.option),
    O.map(R.map((a) => a as NEA.NonEmptyArray<S.Rect>)),
    O.map(R.map(Z.fromNonEmptyArray)),
  )
