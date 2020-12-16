import * as C from 'graphics-ts/lib/Canvas'
import { Rect } from 'graphics-ts/lib/Shape'

export interface OffsetImage {
  src: C.ImageSource
  offset: Rect
  output: Rect
}
export const draw = ({ src, offset, output }: OffsetImage) =>
  C.drawImageFull(
    src,
    offset.x,
    offset.y,
    offset.width,
    offset.height,
    output.x,
    output.y,
    output.width,
    output.height,
  )
