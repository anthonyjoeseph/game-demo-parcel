import { Endomorphism } from 'fp-ts/function'
import * as S from 'graphics-ts/lib/Shape'
import {Sprite, tick as tickSprite} from './Sprite'

export interface VelocitySprite extends Sprite {
  pixelsPerMillis: S.Point
}

export const tick = (
  delta: number
): Endomorphism<VelocitySprite> => (vsprite) => ({
  ...vsprite,
  ...tickSprite(delta)(vsprite),
  position: {
    x: vsprite.position.x + (delta * vsprite.pixelsPerMillis.x),
    y: vsprite.position.y + (delta * vsprite.pixelsPerMillis.y),
  },
})