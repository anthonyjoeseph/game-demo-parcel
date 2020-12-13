export const matchArrows = <A>(
  { left, down, right, up, }:
    { left: A, down: A, right: A, up: A, },
) => (
  defaultVal: A
) => (keycode: string) => {
  switch (keycode) {
    case 'ArrowLeft':
      return left
    case 'ArrowDown':
      return down
    case 'ArrowRight':
      return right
    case 'ArrowUp':
      return up
    default:
      return defaultVal
  }
}