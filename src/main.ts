import './style.css'
import * as PIXI from 'pixi.js'
import '@pixi/graphics-extras'
import { get_theme } from './theme'

const timeline_div = document.getElementById('timeline') ?? undefined
const mouse_year_b = document.getElementById('mouse_year') ?? undefined

const theme = get_theme()

const app = new PIXI.Application({
  background: theme['timeline-bg-color'],
  resizeTo: timeline_div,
})

const VIEW_X_POS = timeline_div?.getBoundingClientRect().x ?? 0
const VIEW_X_MARGIN = 35

const now = new Date()
const START_YEAR = 0
const END_YEAR = now.getFullYear()
const YEAR_SPAN = END_YEAR - START_YEAR

const MIN_ZOOM = 1
const MAX_ZOOM = YEAR_SPAN / 2
const ZOOM_RATE = .005

const YEAR_TICK_HEIGHT = 32
const DECADE_TICK_HEIGHT = 64
const CENTURY_TICK_HEIGHT = 96

const YEAR_SPAN_CENTURY_TICK_VISIBLE = 2500
const YEAR_SPAN_CENTURY_LABEL_VISIBLE = 2500
const YEAR_SPAN_DECADE_TICK_VISIBLE = 1000
const YEAR_SPAN_DECADE_LABEL_VISIBLE = 275
const YEAR_SPAN_YEAR_TICK_VISIBLE = 250
const YEAR_SPAN_YEAR_LABEL_VISIBLE = 35

let start_year = START_YEAR
let year_span = YEAR_SPAN
let pixels_per_year = (app.view.width - 2 * VIEW_X_MARGIN) / year_span
let zoom = 1.0
let global_mouse_x = app.view.width / 2
let mouse_x = 0
let mouse_year

timeline_div?.appendChild(app.view as unknown as Node)

const timeline_container = new PIXI.Container()
const century_label_container = new PIXI.Container()
const decade_label_container = new PIXI.Container()
const year_label_container = new PIXI.Container()

const century_ticks = new PIXI.Graphics()
const decade_ticks = new PIXI.Graphics()
const year_ticks = new PIXI.Graphics()

const century_text_style = new PIXI.TextStyle({
  fontSize: 14,
})
const century_labels: { [year: number]: PIXI.Text } = {}
for (let y = START_YEAR; y <= END_YEAR; y += 100) {
  const label = new PIXI.Text(format_year(y), century_text_style)
  label.x = (y - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
  label.y = app.view.height - CENTURY_TICK_HEIGHT
  label.anchor.set(0.5, 1)
  century_label_container.addChild(label)
  century_labels[y] = label
}

const decade_text_style = new PIXI.TextStyle({
  fontSize: 12,
})
const decade_labels: { [year: number]: PIXI.Text } = {}
for (let y = START_YEAR; y <= END_YEAR; y += 10) {
  if (y % 100 !== 0) {
    const label = new PIXI.Text(format_year(y), decade_text_style)
    label.x = (y - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
    label.y = app.view.height - DECADE_TICK_HEIGHT
    label.anchor.set(0.5, 1)
    decade_label_container.addChild(label)
    decade_labels[y] = label
  }
}

const year_text_style = new PIXI.TextStyle({
  fontSize: 10,
})
const year_labels: { [year: number]: PIXI.Text } = {}
for (let y = START_YEAR; y <= END_YEAR; y += 1) {
  if (y % 10 !== 0) {
    const label = new PIXI.Text(format_year(y), year_text_style)
    label.x = (y - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
    label.y = app.view.height - YEAR_TICK_HEIGHT
    label.anchor.set(0.5, 1)
    year_label_container.addChild(label)
    year_labels[y] = label
  }
}

timeline_container
  .addChild(century_ticks)
  .addChild(decade_ticks)
  .addChild(year_ticks)
  .addChild(century_label_container)
  .addChild(decade_label_container)
  .addChild(year_label_container)
app.stage.addChild(timeline_container)
draw_ticks()

app.stage.eventMode = 'static'
app.stage.hitArea = new PIXI.Rectangle(0, 0, app.view.width, app.view.height)
window.addEventListener('resize', () => {
  pixels_per_year = calc_pixels_per_year(year_span)
  draw_ticks()
  update_label_positions()
})
app.stage.addEventListener('pointermove', (e) => { global_mouse_x = e.x })
app.stage.addEventListener('wheel', handle_mouse_wheel)
app.ticker.add(() => {
  mouse_x = global_mouse_x - VIEW_X_POS - VIEW_X_MARGIN
  mouse_year = start_year + mouse_x / pixels_per_year
  if (mouse_year_b) mouse_year_b.innerText = format_year(mouse_year).toString()
  start_year = START_YEAR - timeline_container.x / pixels_per_year
  draw_ticks()
  update_label_positions()
})

function handle_mouse_wheel(e: WheelEvent) {
  e.preventDefault()

  global_mouse_x = e.x
  const zoom_mult = calc_zoom(e.deltaY)
  year_span = YEAR_SPAN / zoom
  pixels_per_year = calc_pixels_per_year(year_span)
  const tl_container_width = YEAR_SPAN * pixels_per_year + 2 * VIEW_X_MARGIN

  // Prevents too much horizontal sliding when zooming
  const wheel_delta_x = e.deltaY > 2 ? 0 : e.deltaX
  let x_offset = -1 * (((mouse_x - timeline_container.x) * zoom_mult) - mouse_x) - wheel_delta_x

  if (x_offset > 0 || zoom === 1) {
    x_offset = 0
  } else if (tl_container_width + timeline_container.x <= app.view.width) {
    x_offset = app.view.width - tl_container_width
  }
  timeline_container.x = x_offset
}

function format_year(year: number) {
  const era = year < 0 ? 'BCE' : 'CE'
  return `${Math.abs(Math.floor(year))} ${era}`
}

function calc_pixels_per_year(year_span: number) {
  return (app.view.width - 2 * VIEW_X_MARGIN) / year_span
}

function calc_zoom(delta_y: number): number {
  const zoom_delta = delta_y * ZOOM_RATE
  const new_zoom = zoom * (1 + zoom_delta)
  let zoom_mult = 1
  if (new_zoom < MIN_ZOOM) {
    zoom = MIN_ZOOM
  } else if (new_zoom > MAX_ZOOM) {
    zoom_mult = MAX_ZOOM / zoom
    zoom = MAX_ZOOM
  } else {
    zoom_mult = new_zoom / zoom
    zoom = new_zoom
  }
  return zoom_mult
}

function draw_ticks() {
  console.log(year_span)
  if (year_span <= YEAR_SPAN_YEAR_TICK_VISIBLE) { draw_year_ticks() } else { year_ticks.clear() }
  if (year_span <= YEAR_SPAN_DECADE_TICK_VISIBLE) { draw_decade_ticks() } else { decade_ticks.clear() }
  if (year_span <= YEAR_SPAN_CENTURY_TICK_VISIBLE) { draw_century_ticks() } else { century_ticks.clear() }
}

function draw_year_ticks() {
  year_ticks.clear()
  year_ticks.lineStyle({ width: 1, color: theme['year-tick-color'] })
  const start = Math.floor(start_year - START_YEAR)
  const end = Math.ceil(start + year_span + 5)
  for (let year_count = start; year_count <= end; year_count += 1) {
    if (year_count % 10 !== 0) {
      const x_pos = year_count * pixels_per_year + VIEW_X_MARGIN
      year_ticks.moveTo(x_pos, app.view.height)
      year_ticks.lineTo(x_pos, app.view.height - YEAR_TICK_HEIGHT)
    }
  }
}

function draw_decade_ticks() {
  decade_ticks.clear()
  decade_ticks.lineStyle({ width: 2, color: theme['decade-tick-color'] })
  const start_decade = Math.floor(start_year / 10) * 10
  const start = Math.floor(start_decade - START_YEAR)
  const end = Math.ceil(start_decade + year_span + 10)
  for (let year_count = start; year_count <= end; year_count += 10) {
    if (year_count % 100 !== 0) {
      const x_pos = year_count * pixels_per_year + VIEW_X_MARGIN
      decade_ticks.moveTo(x_pos, app.view.height)
      decade_ticks.lineTo(x_pos, app.view.height - DECADE_TICK_HEIGHT)
    }
  }
}

function draw_century_ticks() {
  century_ticks.clear()
  century_ticks.lineStyle({ width: 2, color: theme['century-tick-color'] })
  const start_century = Math.floor(start_year / 100) * 100
  const start = Math.floor(start_century - START_YEAR)
  const end = Math.ceil(start_century + year_span + 100)
  for (let year = start; year <= end; year += 100) {
    const x_pos = year * pixels_per_year + VIEW_X_MARGIN
    century_ticks.moveTo(x_pos, app.view.height)
    century_ticks.lineTo(x_pos, app.view.height - CENTURY_TICK_HEIGHT)
  }
}

function update_label_positions() {
  const years_in_margin = VIEW_X_MARGIN / pixels_per_year
  const visible_start_year = start_year - years_in_margin
  const visible_end_year = visible_start_year + year_span + 2 * years_in_margin

  if (year_span <= YEAR_SPAN_YEAR_LABEL_VISIBLE) {
    year_label_container.visible = true
    update_year_label_positions(visible_start_year, visible_end_year)
  } else {
    year_label_container.visible = false
  }

  if (year_span <= YEAR_SPAN_DECADE_LABEL_VISIBLE) {
    decade_label_container.visible = true
    update_decade_label_positions(visible_start_year, visible_end_year)
  } else {
    decade_label_container.visible = false
  }

  if (year_span <= YEAR_SPAN_CENTURY_LABEL_VISIBLE) {
    century_label_container.visible = true
    update_century_label_positions(visible_start_year, visible_end_year)
  } else {
    century_label_container.visible = false
  }
}

function update_year_label_positions(visible_start_year: number, visible_end_year: number) {
  for (let year_count = 0; year_count <= YEAR_SPAN; year_count += 1) {
    const year = year_count + START_YEAR
    const label = year_labels[year]
    if (label) {
      if (year >= visible_start_year && year <= visible_end_year) {
        label.x = year_count * pixels_per_year + VIEW_X_MARGIN
        label.visible = true
      } else {
        label.visible = false
      }
    }
  }
}

function update_decade_label_positions(visible_start_year: number, visible_end_year: number) {
  for (let year_count = 0; year_count <= YEAR_SPAN; year_count += 10) {
    const year = year_count + START_YEAR
    const label = decade_labels[year]
    if (label) {
      if (year >= visible_start_year && year <= visible_end_year) {
        label.x = year_count * pixels_per_year + VIEW_X_MARGIN
        label.visible = true
      } else {
        label.visible = false
      }
    }
  }
}

function update_century_label_positions(visible_start_year: number, visible_end_year: number) {
  for (let year_count = 0; year_count <= YEAR_SPAN; year_count += 100) {
    const year = year_count + START_YEAR
    const label = century_labels[year]
    if (label) {
      if (year >= visible_start_year && year <= visible_end_year) {
        label.x = year_count * pixels_per_year + VIEW_X_MARGIN
        label.visible = true
      } else {
        label.visible = false
      }
    }
  }
}
