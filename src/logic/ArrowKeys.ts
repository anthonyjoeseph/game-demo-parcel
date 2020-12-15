import { Key } from 'ts-key-enum'

export const matchArrows = <A>({
  left,
  down,
  right,
  up,
}: {
  left: A
  down: A
  right: A
  up: A
}) => (defaultVal: A) => (keycode: string) => {
  switch (keycode) {
    case Key.ArrowLeft:
      return left
    case Key.ArrowDown:
      return down
    case Key.ArrowRight:
      return right
    case Key.ArrowUp:
      return up
    default:
      return defaultVal
  }
}
