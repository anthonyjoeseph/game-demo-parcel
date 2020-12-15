import * as C from 'graphics-ts/lib/Canvas'
import { Box } from './Box'

export interface OffsetImage {
  src: C.ImageSource
  offset: Box
  output: Box
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
