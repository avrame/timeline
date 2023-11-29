import "./style.css"
import * as PIXI from "pixi.js"
import "@pixi/graphics-extras"
import { get_theme } from "./theme"
import { format_year } from "./utils"
import LabelContainer from "./LabelContainer"
import { CENTURY_TICK_HEIGHT, DECADE_TICK_HEIGHT, MAX_ZOOM, MILLENNIUM_TICK_HEIGHT, MIN_ZOOM, START_YEAR, VIEW_X_MARGIN, YEAR_SPAN, YEAR_SPAN_CENTURY_LABEL_VISIBLE, YEAR_SPAN_CENTURY_TICK_VISIBLE, YEAR_SPAN_DECADE_LABEL_VISIBLE, YEAR_SPAN_DECADE_TICK_VISIBLE, YEAR_SPAN_MILLENNIUM_LABEL_VISIBLE, YEAR_SPAN_MILLENNIUM_TICK_VISIBLE, YEAR_SPAN_YEAR_LABEL_VISIBLE, YEAR_SPAN_YEAR_TICK_VISIBLE, YEAR_TICK_HEIGHT, ZOOM_RATE, century_text_style, decade_text_style, millennium_text_style, year_text_style } from "./config"
import TickContainer from "./TickContainer"

const timeline_div = document.getElementById("timeline") ?? undefined
const mouse_year_b = document.getElementById("mouse_year") ?? undefined

const theme = get_theme()

const app = new PIXI.Application({
  background: theme["timeline-bg-color"],
  resizeTo: timeline_div,
})

const VIEW_X_POS = timeline_div?.getBoundingClientRect().x ?? 0

let start_year = START_YEAR
let year_span = YEAR_SPAN
let pixels_per_year = (app.view.width - 2 * VIEW_X_MARGIN) / year_span
let zoom = 1.0
let global_mouse_x = app.view.width / 2
let mouse_x = 0
let mouse_year

timeline_div?.appendChild(app.view as unknown as Node)

const timeline_container = new PIXI.Container()

// Create label containers
const millennium_label_container = new LabelContainer({
  label_year_span: 1000,
  pixels_per_year,
  app_height: app.view.height,
  tick_height: MILLENNIUM_TICK_HEIGHT,
  label_style: millennium_text_style,
  timeline_container,
  year_span_label_visible: YEAR_SPAN_MILLENNIUM_LABEL_VISIBLE
})
const century_label_container = new LabelContainer({
  label_year_span: 100,
  pixels_per_year,
  app_height: app.view.height,
  tick_height: CENTURY_TICK_HEIGHT,
  label_style: century_text_style,
  timeline_container,
  year_span_label_visible: YEAR_SPAN_CENTURY_LABEL_VISIBLE
})
const decade_label_container = new LabelContainer({
  label_year_span: 10,
  pixels_per_year,
  app_height: app.view.height,
  tick_height: DECADE_TICK_HEIGHT,
  label_style: decade_text_style,
  timeline_container,
  year_span_label_visible: YEAR_SPAN_DECADE_LABEL_VISIBLE
})
const year_label_container = new LabelContainer({
  label_year_span: 1,
  pixels_per_year,
  app_height: app.view.height,
  tick_height: YEAR_TICK_HEIGHT,
  label_style: year_text_style,
  timeline_container,
  year_span_label_visible: YEAR_SPAN_YEAR_LABEL_VISIBLE
})
const label_containers = [millennium_label_container, century_label_container, decade_label_container, year_label_container]

const millennium_ticks = new TickContainer(1000, timeline_container, YEAR_SPAN_MILLENNIUM_TICK_VISIBLE, MILLENNIUM_TICK_HEIGHT, theme["millennium-tick-color"])
const century_ticks = new TickContainer(100, timeline_container, YEAR_SPAN_CENTURY_TICK_VISIBLE, CENTURY_TICK_HEIGHT, theme["century-tick-color"])
const decade_ticks = new TickContainer(10, timeline_container, YEAR_SPAN_DECADE_TICK_VISIBLE, DECADE_TICK_HEIGHT, theme["decade-tick-color"])
const year_ticks = new TickContainer(1, timeline_container, YEAR_SPAN_YEAR_TICK_VISIBLE, YEAR_TICK_HEIGHT, theme["year-tick-color"])
const tick_containers = [year_ticks, decade_ticks, century_ticks, millennium_ticks]

app.stage.addChild(timeline_container)
draw_ticks()

app.stage.eventMode = "static"
app.stage.hitArea = new PIXI.Rectangle(0, 0, app.view.width, app.view.height)
window.addEventListener("resize", () => {
  pixels_per_year = calc_pixels_per_year(year_span)
})
app.stage.addEventListener("pointermove", (e) => {
  global_mouse_x = e.x
})
app.stage.addEventListener("wheel", handle_mouse_wheel)
app.ticker.add((dt: number) => {
  mouse_x = global_mouse_x - VIEW_X_POS - VIEW_X_MARGIN
  mouse_year = start_year + mouse_x / pixels_per_year
  if (mouse_year_b) mouse_year_b.innerText = format_year(mouse_year).toString()
  start_year = START_YEAR - timeline_container.x / pixels_per_year
  draw_ticks()
  update_label_positions(dt)
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
  let x_offset =
    -1 * ((mouse_x - timeline_container.x) * zoom_mult - mouse_x) -
    wheel_delta_x

  if (x_offset > 0 || zoom === 1) {
    x_offset = 0
  } else if (tl_container_width + timeline_container.x <= app.view.width) {
    x_offset = app.view.width - tl_container_width
  }
  timeline_container.x = x_offset
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
  for (const tick_container of tick_containers) {
    tick_container.draw(start_year, year_span, pixels_per_year, app.view.height)
  }
}

function update_label_positions(dt: number) {
  const years_in_margin = VIEW_X_MARGIN / pixels_per_year
  const visible_start_year = start_year - years_in_margin
  const visible_end_year = visible_start_year + year_span + 2 * years_in_margin

  for (const label_container of label_containers) {
    label_container.update_labels(year_span, visible_start_year, visible_end_year, pixels_per_year, dt)
  }
}
