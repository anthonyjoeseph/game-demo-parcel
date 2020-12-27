import { drawSprite } from '../lib/Sprite'
import { GameObject } from './GameObject'

export const draw = (state: GameObject) => drawSprite(state.sprite)
