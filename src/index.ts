import * as r from 'rxjs'
import { error } from 'fp-ts/Console'
import { pipe } from 'fp-ts/pipeable'
import { render$ } from './Game'
import { renderTo$ } from './lib/Render'
import { Key } from 'ts-key-enum'

const gameLoop = pipe(
  render$,
  renderTo$('canvas', () => error('canvas not found')),
)
gameLoop.subscribe()

// prevent arrow keys from scrolling the page
r.fromEvent(window, 'keydown').subscribe((e) => {
  const code = (e as KeyboardEvent).code
  if (code === Key.ArrowUp || code === Key.ArrowDown || code === Key.ArrowLeft || code === Key.ArrowRight) {
    e.preventDefault()
  }
})

const canvas = document.getElementById('canvas') as HTMLCanvasElement | null
if (canvas) {
  r.merge(r.fromEvent(window, 'resize'), r.fromEvent(window, 'load')).subscribe(() => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}
