import { pipe } from 'fp-ts/pipeable'
import * as O from 'fp-ts/Option'
import * as TO from 'fp-ts-contrib/TaskOption'
import * as S from 'graphics-ts/lib/Shape'
import { FrameRecordCodec } from '../lib/Spritesheet'
import greenCap from '../spritesheet/spritesheet.png'
import { fetchImageElement } from '../lib/Image'
import * as frameJson from '../spritesheet/frameRecord.json'
import { sequenceT } from 'fp-ts/lib/Apply'
import { parseWalkingFrames } from './Frames'
import { GameObject } from './GameObject'

export const initializeGameObject: TO.TaskOption<GameObject> = pipe(
  sequenceT(TO.taskOption)(
    TO.fromTaskEither(fetchImageElement(greenCap)),
    pipe(
      frameJson,
      FrameRecordCodec.decode,
      O.fromEither,
      O.chain(parseWalkingFrames),
      TO.fromOption,
    ),
  ),
  TO.map(([src, walkingFrames]) => ({
    src,
    walkingFrames,
    currentFrames: walkingFrames.down,
    rect: S.rect(0, 0, 50, 56),
    velocity: { x: 0, y: 0 },
  })),
)
