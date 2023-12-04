import "./style.css"
import * as PIXI from "pixi.js"
import "@pixi/graphics-extras"
import { format_year } from "./utils"
import LabelGroup from "./LabelGroup"
import { theme, MAX_ZOOM, MIN_ZOOM, START_YEAR, VIEW_X_MARGIN, YEAR_SPAN, ZOOM_RATE, END_YEAR } from "./config"
import TickGroup from "./TickGroup"

const timeline_div = document.getElementById("timeline") ?? undefined
const mouse_year_b = document.getElementById("mouse_year") ?? undefined

const app = new PIXI.Application({
  background: theme["timeline-bg-color"],
  resizeTo: timeline_div,
})

const VIEW_X_POS = timeline_div?.getBoundingClientRect().x ?? 0

let visible_start_year = START_YEAR
let visible_end_year = END_YEAR
let visible_year_span = YEAR_SPAN
let pixels_per_year = (app.view.width - 2 * VIEW_X_MARGIN) / visible_year_span
let zoom = 1.0
let global_mouse_x = app.view.width / 2
let mouse_x = 0
let mouse_year
let wheel_delta_y = 0

timeline_div?.appendChild(app.view as unknown as Node)

const timeline_container = new PIXI.Container()

// Create arrays of label and tick containers
const label_groups: LabelGroup[] = []
const tick_groups: TickGroup[] = []
for (let i = 1; i <= 1000; i *= 10) {
  const label_container = new LabelGroup(i, pixels_per_year, app.view.height)
  label_container.add_to(timeline_container)
  label_groups.push(label_container)

  const tick_container = new TickGroup(i)
  tick_container.add_to(timeline_container)
  tick_groups.push(tick_container)
}

app.stage.addChild(timeline_container)

app.stage.eventMode = "static"
app.stage.hitArea = new PIXI.Rectangle(0, 0, app.view.width, app.view.height)

window.addEventListener("resize", () => {
  pixels_per_year = calc_pixels_per_year(visible_year_span)
})

app.stage.addEventListener("pointermove", (e) => {
  global_mouse_x = e.x
})

app.stage.addEventListener("wheel", (e: WheelEvent) => {
  e.preventDefault()

  wheel_delta_y = e.deltaY

  global_mouse_x = e.x
  const zoom_mult = calc_zoom(wheel_delta_y)
  visible_year_span = YEAR_SPAN / zoom
  pixels_per_year = calc_pixels_per_year(visible_year_span)
  const tl_container_width = YEAR_SPAN * pixels_per_year + 2 * VIEW_X_MARGIN

  // Prevents too much horizontal sliding when zooming
  const wheel_delta_x = wheel_delta_y > 2 ? 0 : e.deltaX
  let x_offset = -((mouse_x - timeline_container.x) * zoom_mult - mouse_x) - wheel_delta_x

  if (x_offset > 0 || zoom === 1) {
    x_offset = 0
  } else if (visible_end_year >= END_YEAR + (VIEW_X_MARGIN + .2) / pixels_per_year) {
    x_offset = app.view.width - tl_container_width
  }
  timeline_container.x = x_offset
})

app.ticker.add((dt: number) => {
  mouse_x = global_mouse_x - VIEW_X_POS - VIEW_X_MARGIN
  mouse_year = visible_start_year + mouse_x / pixels_per_year
  if (mouse_year_b) mouse_year_b.innerText = format_year(mouse_year).toString()
  visible_start_year = START_YEAR - timeline_container.x / pixels_per_year
  visible_end_year = visible_start_year + visible_year_span + VIEW_X_MARGIN / pixels_per_year
  draw_ticks(dt)
  update_label_positions(dt)
})

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

function draw_ticks(dt: number) {
  for (const tick_container of tick_groups) {
    tick_container.draw(visible_start_year, visible_year_span, pixels_per_year, app.view.height, wheel_delta_y, dt)
  }
}

function update_label_positions(dt: number) {
  const years_in_margin = VIEW_X_MARGIN / pixels_per_year
  const visible_start_year_adjusted = visible_start_year - years_in_margin
  const visible_end_year_adjusted = visible_start_year + visible_year_span + years_in_margin

  for (const label_container of label_groups) {
    label_container.update_labels(visible_start_year_adjusted, visible_end_year_adjusted, pixels_per_year, app.view.height, wheel_delta_y, dt)
  }
}
