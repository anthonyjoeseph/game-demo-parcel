import { Endomorphism, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as S from 'graphics-ts/lib/Shape'
import { Box } from '../lib/Box'
import { contains } from '../lib/Box'
import { Sprite, animate as animateSprite } from '../lib/Sprite'

export interface GameObject {
  readonly sprite: Sprite
  readonly velocity: S.Point
  readonly animating: boolean
}

export const move = (delta: number, windowBox: Box): Endomorphism<GameObject> => (
  go,
) => ({
  ...go,
  sprite: {
    ...go.sprite,
    box: pipe(
      {
        ...go.sprite.box,
        x: go.sprite.box.x + delta * go.velocity.x,
        y: go.sprite.box.y + delta * go.velocity.y,
      },
      O.fromPredicate(contains(windowBox)),
      O.getOrElse(() => go.sprite.box),
    ),
  },
})

export const animate = (deltaMillis: number): Endomorphism<GameObject> => (go) => ({
  ...go,
  sprite: go.animating ? animateSprite(deltaMillis)(go.sprite) : go.sprite,
})
