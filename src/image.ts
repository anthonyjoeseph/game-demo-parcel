import * as T from 'fp-ts/Task'

export const spriteImage: T.Task<HTMLImageElement> = () => new Promise(resolve => {
  let img = new Image();
  img.src = 'https://opengameart.org/sites/default/files/Green-Cap-Character-16x18.png';
  img.onload = function() {
    resolve(img);
  };
})