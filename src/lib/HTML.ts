import * as IO from 'fp-ts/IO'
import { Box } from './Box'

export const setHtmlElementBox = (
  element: HTMLElement & { width: number; height: number },
) => (box: Box): IO.IO<void> => () => {
  element.style.left = box.x + 'px'
  element.style.top = box.y + 'px'
  element.width = box.width
  element.height = box.height
}
