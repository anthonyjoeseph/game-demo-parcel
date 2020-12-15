import * as T from 'fp-ts/Task'
import greenCap from './greenCap.png'
import fetchIMG from 'fetch-img'

export const spriteImage: T.Task<HTMLImageElement> = () => fetchIMG(greenCap)
