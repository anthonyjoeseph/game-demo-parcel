import { Endomorphism } from 'fp-ts/function'
import * as S from 'graphics-ts/lib/Shape'
import { Sprite, animate as animateSprite } from '../lib/Sprite'

export interface GameObject {
  readonly sprite: Sprite
  readonly velocity: S.Point
}

export const move = (delta: number): Endomorphism<GameObject> => (go) => ({
  ...go,
  sprite: {
    ...go.sprite,
    box: {
      ...go.sprite.box,
      x: go.sprite.box.x + delta * go.velocity.x,
      y: go.sprite.box.y + delta * go.velocity.y,
    },
  },
})

export const animate = (deltaMillis: number): Endomorphism<GameObject> => (go) => ({
  ...go,
  sprite: animateSprite(deltaMillis)(go.sprite),
})
