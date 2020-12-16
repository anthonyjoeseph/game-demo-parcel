import { Endomorphism, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as S from 'graphics-ts/lib/Shape'
import { Rect } from 'graphics-ts/lib/Shape'
import { contains } from '../lib/Collision'
import { Sprite, animate as animateSprite } from '../lib/Sprite'

export interface GameObject {
  readonly sprite: Sprite
  readonly velocity: S.Point
  readonly animating: boolean
}

export const move = (delta: number, windowRect: Rect): Endomorphism<GameObject> => (
  go,
) => ({
  ...go,
  sprite: {
    ...go.sprite,
    rect: pipe(
      {
        ...go.sprite.rect,
        x: go.sprite.rect.x + delta * go.velocity.x,
        y: go.sprite.rect.y + delta * go.velocity.y,
      },
      O.fromPredicate(contains(windowRect)),
      O.getOrElse(() => go.sprite.rect),
    ),
  },
})

export const animate = (deltaMillis: number): Endomorphism<GameObject> => (go) => ({
  ...go,
  sprite: go.animating ? animateSprite(deltaMillis)(go.sprite) : go.sprite,
})
