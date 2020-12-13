import { pipe } from 'fp-ts/pipeable'
import { without, upsert } from 'fp-ts-std/Array'
import * as Eq from 'fp-ts/Eq'
import * as O from 'fp-ts/Option'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import { Key } from 'ts-key-enum'

const KeyEq = Eq.eqString as Eq.Eq<Key>
const codeFromEvent = (event: Event): Key =>
  (event as KeyboardEvent).code as Key

type PressType = 'up' | 'down'
interface Press { code: Key; type: PressType }

export const currentKeys$ = pipe(
  r.merge(
    pipe(
      r.fromEvent(document, 'keydown'),
      ro.map(codeFromEvent),
      ro.map((code): Press => ({ code, type: 'down' })),
    ),
    pipe(
      r.fromEvent(document, 'keyup'),
      ro.map(codeFromEvent),
      ro.map((code): Press => ({ code, type: 'up' })),
    )
  ),
  ro.scan((currentKeyCodes: Key[], press: Press) => {
    if (press.type === 'up') {
      return without(KeyEq)([press.code])(currentKeyCodes)
    }
    return upsert(KeyEq)(press.code)(currentKeyCodes)
  }, []),
  ro.startWith([] as Key[]),
)

// adapted from from Juan Herrera's article here:
// https://medium.com/@jdjuan/mouse-drag-with-rxjs-45861c4d0b7e
export const mouseDrag$: r.Observable<O.Option<Event>> = pipe(
  r.fromEvent(document, 'mousedown'),
  ro.mergeMap(down => pipe(
    r.fromEvent(document, 'mousemove'),
    ro.map(O.some),
    ro.takeUntil(r.fromEvent(document, 'mouseup')),
    ro.startWith(O.some(down)),
    ro.endWith(O.none),
  )),
  ro.startWith(O.none)
)
