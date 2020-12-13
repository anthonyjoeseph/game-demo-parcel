import { Endomorphism } from 'fp-ts/function'
import * as S from 'graphics-ts/lib/Shape'
import {Sprite, updateSprite} from './Sprite'

export interface VelocitySprite extends Sprite {
  pixelsPerMillis: S.Point
}

export const updateVelocitySprite = (
  delta: number
): Endomorphism<VelocitySprite> => (vsprite) => ({
  ...updateSprite(delta)(vsprite),
  pixelsPerMillis: vsprite.pixelsPerMillis,
  position: {
    x: vsprite.position.x + (delta * vsprite.pixelsPerMillis.x),
    y: vsprite.position.y + (delta * vsprite.pixelsPerMillis.y),
  },
})