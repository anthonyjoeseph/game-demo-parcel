import * as C from 'graphics-ts/lib/Canvas'
import F from 'flatten-js'
import { Sprite } from './Sprite'
import { spriteFramesWithIndex } from "./frames"

export const initializeSprite = (src: C.ImageSource): Sprite => {
  console.log('initiaizing')
  const frames = spriteFramesWithIndex(0)
  console.log(`frames length: ${frames.lefts.length}`)
  return ({
    src,
    animationDelta: 0,
    frames,
    velocity: new F.Point(0, 0),
    animating: false,
    box: new F.Box(0, 0, 16, 18),
  })
}