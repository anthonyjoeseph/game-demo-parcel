import { error } from 'fp-ts/lib/Console'
import * as RA from 'fp-ts/lib/ReadonlyArray'
import * as C from 'graphics-ts/lib/Canvas'
import * as Color from 'graphics-ts/lib/Color'
import * as D from 'graphics-ts/lib/Drawing'
import * as S from 'graphics-ts/lib/Shape'

const canvasId = 'canvas'
const triangle: C.Render<void> = D.render(
  D.fill(
    S.path(RA.readonlyArray)([S.point(75, 50), S.point(100, 75), S.point(100, 25)]),
    D.fillStyle(Color.black)
  )
)
C.renderTo(canvasId, () => error(`[ERROR]: Unable to find canvas with id ${canvasId}`))(triangle)()
