import * as t from 'io-ts'
import { readonlyNonEmptyArray } from 'io-ts-types/readonlyNonEmptyArray'
import { withFallback } from 'io-ts-types/withFallback'

export interface HexColorBrand {
  readonly HexColor: unique symbol
}
export const HexColorCodec = t.brand(
  t.string,
  (h): h is t.Branded<string, HexColorBrand> =>
    h.startsWith('#') && (h.length === 7 || h.length === 9) && /[0-9A-Fa-f]{6}/g.test(h),
  'HexColor',
)

const TextCodec = t.intersection([
  t.intersection([
    t.type({
      text: t.string,
    }),
    withFallback(
      t.type({
        halign: t.keyof({
          center: null,
          right: null,
          justify: null,
          left: null,
        }),
      }),
      { halign: 'left' },
    ),
    withFallback(t.type({ bold: t.boolean }), { bold: false }),
    withFallback(t.type({ fontfamily: t.string }), { fontfamily: 'sans-serif' }),
    withFallback(t.type({ color: HexColorCodec }), {
      color: '#000000' as t.Branded<string, HexColorBrand>,
    }),
  ]),
  t.intersection([
    withFallback(t.type({ italic: t.boolean }), { italic: false }),
    withFallback(t.type({ kerning: t.boolean }), { kerning: true }),
    withFallback(t.type({ pixelsize: t.Int }), {
      pixelsize: 16 as t.Branded<number, t.IntBrand>,
    }),
    withFallback(t.type({ strikeout: t.boolean }), { strikeout: false }),
    withFallback(t.type({ underline: t.boolean }), { underline: false }),
  ]),
  t.intersection([
    withFallback(t.type({ valign: t.keyof({ center: null, bottom: null, top: null }) }), {
      valign: 'top',
    }),
    withFallback(t.type({ wrap: t.boolean }), { wrap: false }),
  ]),
])

const FrameCodec = t.type({
  tileid: t.Int,
  duration: t.Int,
})

export type FrameCodec = t.TypeOf<typeof FrameCodec>

const AnimationCodec = t.readonlyArray(FrameCodec)

export type Animation = t.TypeOf<typeof AnimationCodec>

const ChunkCodec = t.type({
  data: t.union([t.readonlyArray(t.Int), t.string]),
  height: t.Int,
  width: t.Int,
  x: t.Int,
  y: t.Int,
})

const PointCodec = t.type({
  x: t.number,
  y: t.number,
})

const GridCodec = t.intersection([
  t.type({
    height: t.number,
    width: t.number,
  }),
  withFallback(
    t.type({
      orientation: t.keyof({
        orthogonal: null,
        isometric: null,
      }),
    }),
    { orientation: 'orthogonal' },
  ),
])

const PropertyCodec = t.intersection([
  t.type({ name: t.string }),
  t.union([
    t.intersection([
      t.type({
        value: t.string,
      }),
      withFallback(t.type({ type: t.literal('string') }), { type: 'string' }),
    ]),
    t.type({
      value: t.string,
      type: t.literal('file'),
    }),
    t.type({
      value: HexColorCodec,
      type: t.literal('color'),
    }),
    t.type({
      value: t.Int,
      type: t.literal('int'),
    }),
    t.type({
      value: t.number,
      type: t.literal('float'),
    }),
    t.type({
      value: t.boolean,
      type: t.literal('bool'),
    }),
  ]),
])

const TerrainCodec = t.type({
  name: t.string,
  properties: t.readonlyArray(PropertyCodec),
  tile: t.Int,
})

const WangColorCodec = t.type({
  color: HexColorCodec,
  name: t.string,
  probability: t.number,
  tile: t.Int,
})

const WangTileCodec = t.intersection([
  t.type({
    tileid: t.Int,
    wangid: t.readonlyArray(t.Int),
  }),
  withFallback(t.type({ dflip: t.boolean }), { dflip: false }),
  withFallback(t.type({ hflip: t.boolean }), { hflip: false }),
  withFallback(t.type({ vflip: t.boolean }), { vflip: false }),
])

const WangSetCodec = t.type({
  cornercolors: t.readonlyArray(WangColorCodec),
  edgecolors: t.readonlyArray(WangColorCodec),
  name: t.string,
  properties: t.readonlyArray(PropertyCodec),
  tile: t.Int,
  wangtiles: t.readonlyArray(WangTileCodec),
})

const ObjectCodec = t.intersection([
  t.type({
    height: t.Int,
    id: t.Int,
    name: t.string,
    rotation: t.number,
    type: t.string,
    visible: t.boolean,
    width: t.Int,
    x: t.Int,
    y: t.Int,
  }),
  t.partial({
    gid: t.Int,
    ellipse: t.boolean,
    point: t.boolean,
    polygon: readonlyNonEmptyArray(PointCodec),
    polyline: readonlyNonEmptyArray(PointCodec),
    properties: t.readonlyArray(PropertyCodec),
    template: t.string,
    text: TextCodec,
  }),
])

export interface ZeroToOneBrand {
  readonly ZeroToOne: unique symbol
}

const CommonLayerCodec = t.intersection([
  t.type({
    height: t.Int,
    name: t.string,
    opacity: t.brand(
      t.number,
      (o): o is t.Branded<number, ZeroToOneBrand> => 0 <= o && o <= 1,
      'ZeroToOne',
    ),
    properties: t.readonlyArray(PropertyCodec),
    visible: t.boolean,
    width: t.Int,
    x: t.literal(0),
    y: t.literal(0),
  }),
  t.partial({
    id: t.Int,
    staratx: t.Int,
    starty: t.Int,
    tintcolor: HexColorCodec,
  }),
  withFallback(t.type({ offsetx: t.number }), { offsetx: 0 }),
  withFallback(t.type({ offsety: t.number }), { offsety: 0 }),
])

export type CommonLayer = t.TypeOf<typeof CommonLayerCodec>

const TileLayerCodec = t.intersection([
  CommonLayerCodec,
  t.type({
    type: t.literal('tilelayer'),
    data: t.union([t.readonlyArray(t.Int), t.string]),
  }),
  t.partial({
    chunks: t.readonlyArray(ChunkCodec),
    compression: t.keyof({
      zlib: null,
      gzip: null,
      zstd: null,
    }),
  }),
])

export type TileLayer = t.TypeOf<typeof TileLayerCodec>

const ImageLayerCodec = t.intersection([
  CommonLayerCodec,
  t.type({
    type: t.literal('imagelayer'),
  }),
  t.partial({
    transparentcolor: HexColorCodec,
  }),
])

export type ImageLayer = t.TypeOf<typeof ImageLayerCodec>

const ObjectGroupCodec = t.intersection([
  CommonLayerCodec,
  withFallback(
    t.type({
      draworder: t.keyof({ topdown: null, index: null }),
    }),
    {
      draworder: 'topdown',
    },
  ),
  t.type({
    type: t.literal('objectgroup'),
    objects: t.readonlyArray(ObjectCodec),
  }),
])

export type ObjectGroup = t.TypeOf<typeof ObjectGroupCodec>

export interface Group extends CommonLayer {
  type: 'group'
  layers: Layer[]
}

export type Layer = TileLayer | ImageLayer | ObjectGroup | Group

const LayerCodec: t.Type<Layer> = t.recursion(
  'Layer',
  () =>
    (t.union([
      TileLayerCodec,
      ImageLayerCodec,
      t.intersection([
        CommonLayerCodec,
        t.type({
          type: t.literal('group'),
          layers: t.readonlyArray(LayerCodec),
        }),
      ]),
      ObjectGroupCodec,
    ]) as unknown) as t.Type<Layer, Layer, unknown>,
)

const TileCodec = t.intersection([
  t.type({
    id: t.Int,
    properties: t.readonlyArray(PropertyCodec),
    terrain: t.readonlyArray(t.Int),
  }),
  t.partial({
    animation: t.readonlyArray(FrameCodec),
    image: t.string,
    imageheight: t.Int,
    imagewidth: t.Int,
    objectgroup: LayerCodec,
    probability: t.number,
    type: t.string,
  }),
])

const TileOffsetCodec = t.type({
  x: t.number,
  y: t.number,
})

const ObjectGroupTile = t.intersection([
  TileCodec,
  t.type({
    type: t.literal('objectgroup'),
  }),
  t.partial({
    objectgroup: LayerCodec,
  }),
])

const TilesetCodec = t.intersection([
  t.type({
    columns: t.Int,
    firstgid: t.Int,
    image: t.string,
    imageheight: t.Int,
    imagewidth: t.Int,
    margin: t.Int,
    name: t.string,
    properties: t.readonlyArray(PropertyCodec),
    spacing: t.Int,
    tilecount: t.Int,
    tileheight: t.Int,
    tilewidth: t.Int,
  }),
  withFallback(
    t.type({
      objectalignment: t.keyof({
        unspecified: null,
        topleft: null,
        top: null,
        topright: null,
        left: null,
        center: null,
        bottomleft: null,
        bottom: null,
        bottomright: null,
      }),
    }),
    { objectalignment: 'unspecified' },
  ),
  t.partial({
    backgroundcolor: HexColorCodec,
    grid: GridCodec,
    source: t.string,
    terrains: t.readonlyArray(TerrainCodec),
    tiledversion: t.string,
    tileoffset: TileOffsetCodec,
    tiles: t.readonlyArray(TileCodec),
    transparentcolor: HexColorCodec,
    type: t.literal('tileset'),
    version: t.number,
    wangsets: t.readonlyArray(WangSetCodec),
  }),
])

const ObjectTemplateCodec = t.type({
  type: t.literal('template'),
  tileset: TilesetCodec,
  object: ObjectCodec,
})

const MapCodec = t.intersection([
  t.type({
    height: t.Int,
    layers: t.readonlyArray(LayerCodec),
    nextobjectid: t.Int,
    properties: t.readonlyArray(PropertyCodec),
    tiledversion: t.string,
    tileheight: t.Int,
    tilewidth: t.Int,
    version: t.number,
    width: t.Int,
  }),
  withFallback(t.type({ compressionlevel: t.Int }), {
    compressionlevel: -1 as t.Branded<number, t.IntBrand>,
  }),
  t.partial({
    type: t.literal('map'),
    backgroundcolor: HexColorCodec,
    infinite: t.boolean,
    nextlayerid: t.Int,
  }),
  t.union([
    t.intersection([
      t.type({
        orientation: t.literal('orthogonal'),
      }),
      withFallback(
        t.type({
          renderorder: t.keyof({
            'right-down': null,
            'right-up': null,
            'left-down': null,
            'left-up': null,
          }),
        }),
        { renderorder: 'right-down' },
      ),
    ]),
    t.type({
      orientation: t.keyof({
        staggered: null,
        hexagonal: null,
      }),
      staggeraxis: t.keyof({
        x: null,
        y: null,
      }),
      staggerindex: t.keyof({
        odd: null,
        even: null,
      }),
    }),
    t.type({
      orientation: t.literal('isometric'),
    }),
  ]),
])
