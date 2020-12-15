import { Endomorphism, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as S from 'graphics-ts/lib/Shape'
import { Box } from '../lib/Box'
import { contains } from '../lib/Box'
import { Sprite, animate as animateSprite } from '../lib/Sprite'

export interface GameObject {
  readonly sprite: Sprite
  readonly velocity: S.Point
}

const windowBox = (): Box => ({
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight,
})

export const move = (delta: number): Endomorphism<GameObject> => (go) => ({
  ...go,
  sprite: {
    ...go.sprite,
    box: pipe(
      {
        ...go.sprite.box,
        x: go.sprite.box.x + delta * go.velocity.x,
        y: go.sprite.box.y + delta * go.velocity.y,
      },
      O.fromPredicate(contains(windowBox())),
      O.getOrElse(() => go.sprite.box),
    ),
  },
})

export const animate = (deltaMillis: number): Endomorphism<GameObject> => (go) => ({
  ...go,
  sprite: animateSprite(deltaMillis)(go.sprite),
})
