import { Endomorphism } from 'fp-ts/function'
import * as S from 'graphics-ts/lib/Shape'
import {Sprite, updateSprite} from './Sprite'

export interface VelocitySprite extends Sprite {
  pixelsPerMillis: S.Point
}

export const updateVelocitySprite = (
  delta: number
): Endomorphism<VelocitySprite> => (sprite) => {
  if (sprite.pixelsPerMillis.x !== 0) {
    console.log('moving!')
  }
  return ({
    ...updateSprite(delta)(sprite),
    pixelsPerMillis: sprite.pixelsPerMillis,
    position: {
      x: sprite.position.x + (delta * sprite.pixelsPerMillis.x),
      y: sprite.position.y + (delta * sprite.pixelsPerMillis.y),
    },
  })
}