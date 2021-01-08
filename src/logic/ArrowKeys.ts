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
}) => (keycode: string) =>
  (({
    [Key.ArrowLeft]: left,
    [Key.ArrowDown]: down,
    [Key.ArrowRight]: right,
    [Key.ArrowUp]: up,
  } as Record<string, A>)[keycode])
