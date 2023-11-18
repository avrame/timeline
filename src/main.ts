import './style.css'
import * as PIXI from 'pixi.js'
import '@pixi/graphics-extras'

const timeline_div = document.getElementById('timeline') ?? undefined
const mouse_year_b = document.getElementById('mouse_year') ?? undefined

const app = new PIXI.Application({
  background: '#EEF',
  resizeTo: timeline_div,
})

const VIEW_X = timeline_div?.getBoundingClientRect().x ?? 0
const VIEW_WIDTH = app.view.width
const VIEW_HEIGHT = app.view.height
const VIEW_X_MARGIN = 20
const START_YEAR = 1900
const END_YEAR = 2000
const YEAR_SPAN = END_YEAR - START_YEAR
const MIN_ZOOM = 1
const MAX_ZOOM = 7
const ZOOM_RATE = .005

let start_year = START_YEAR
let end_year = END_YEAR
let year_span = YEAR_SPAN
let pixels_per_year = (VIEW_WIDTH - 2 * VIEW_X_MARGIN) / year_span
let zoom = 1.0
let mouse_x = 0
let mouse_year = START_YEAR + YEAR_SPAN / 2

if (mouse_year_b) mouse_year_b.innerText = Math.floor(mouse_year).toString()

timeline_div?.appendChild(app.view as unknown as Node)

const timeline_container = new PIXI.Container()
const label_container = new PIXI.Container()

const decade_ticks = new PIXI.Graphics()
const year_ticks = new PIXI.Graphics()

const decade_text_style = new PIXI.TextStyle({
  fontSize: 14,
})
const decade_labels: { [year: number]: PIXI.Text } = {}
for (let y = START_YEAR; y <= END_YEAR; y += 10) {
  const label = new PIXI.Text(y.toString(), decade_text_style)
  label.x = (y - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
  label.y = VIEW_HEIGHT - 64
  label.anchor.set(0.5, 1)
  label_container.addChild(label)
  decade_labels[y] = label
}

timeline_container
  .addChild(decade_ticks)
  .addChild(year_ticks)
  .addChild(label_container)
app.stage.addChild(timeline_container)
draw_decade_ticks()
draw_year_ticks()

app.stage.eventMode = 'static'
app.stage.hitArea = new PIXI.Rectangle(0, 0, VIEW_WIDTH, VIEW_HEIGHT)

app.stage.addEventListener('mousemove', (e) => calc_mouse_position(e.x))

app.stage.addEventListener('wheel', (e) => {
  e.preventDefault()

  const zoom_mult = calc_zoom(e.deltaY)

  year_span = YEAR_SPAN / zoom

  pixels_per_year = (VIEW_WIDTH - 2 * VIEW_X_MARGIN) / year_span

  calc_mouse_position(e.x)

  draw_decade_ticks()
  update_decade_label_positions()
  draw_year_ticks()

  const x_offset = -1 * (((mouse_x - timeline_container.x) * zoom_mult) - mouse_x)

  if (x_offset > 0 || zoom === 1) {
    timeline_container.x = 0
  } else if (end_year > END_YEAR) {
    timeline_container.x = VIEW_WIDTH - timeline_container.width
  } else {
    timeline_container.x = x_offset
  }

  start_year = START_YEAR - x_offset / pixels_per_year
  end_year = start_year + year_span
})

function calc_zoom(delta_y: number): number {
  const zoom_delta = delta_y * ZOOM_RATE
  const new_zoom = zoom + zoom_delta
  if (new_zoom < MIN_ZOOM) {
    zoom = MIN_ZOOM
    return 1
  } else if (new_zoom > MAX_ZOOM) {
    zoom = MAX_ZOOM
    return 1
  } else {
    const zoom_mult = new_zoom / zoom
    zoom = new_zoom
    return zoom_mult
  }
}

function calc_mouse_position(global_mouse_x: number) {
  mouse_x = global_mouse_x - VIEW_X - VIEW_X_MARGIN
  mouse_year = start_year + mouse_x / pixels_per_year
  if (mouse_year_b) mouse_year_b.innerText = Math.floor(mouse_year).toString()
}

function draw_decade_ticks() {
  decade_ticks.clear()
  decade_ticks.lineStyle({ width: 2, color: '#333' })
  for (let year = 0; year <= YEAR_SPAN; year += 10) {
    const x_pos = year * pixels_per_year + VIEW_X_MARGIN
    decade_ticks.moveTo(x_pos, VIEW_HEIGHT)
    decade_ticks.lineTo(x_pos, VIEW_HEIGHT - 64)
  }
}

function draw_year_ticks() {
  year_ticks.clear()
  year_ticks.lineStyle({ width: 1, color: '#666' })
  for (let year = 0; year <= YEAR_SPAN; year += 1) {
    const x_pos = year * pixels_per_year + VIEW_X_MARGIN
    year_ticks.moveTo(x_pos, VIEW_HEIGHT)
    year_ticks.lineTo(x_pos, VIEW_HEIGHT - 32)
  }
}

function update_decade_label_positions() {
  for (let year = 0; year <= YEAR_SPAN; year += 10) {
    decade_labels[year + START_YEAR].x = year * pixels_per_year + VIEW_X_MARGIN
  }
}
