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
const START_YEAR = 1900
const END_YEAR = 2000
const YEAR_SPAN = END_YEAR - START_YEAR
const MIN_ZOOM = 1
const MAX_ZOOM = 10
const ZOOM_RATE = .005

let start_year = START_YEAR
let end_year = END_YEAR
let year_span = YEAR_SPAN
let pixels_per_year = VIEW_WIDTH / year_span
let zoom = 1.0
let mouse_x = 0
let mouse_year = START_YEAR + YEAR_SPAN / 2

if (mouse_year_b) mouse_year_b.innerText = Math.floor(mouse_year).toString()

timeline_div?.appendChild(app.view as unknown as Node)

const timeline_container = new PIXI.Container()

const decade_ticks = new PIXI.Graphics()
const year_ticks = new PIXI.Graphics()
timeline_container.addChild(decade_ticks).addChild(year_ticks)
app.stage.addChild(timeline_container)
draw_decade_ticks()
draw_year_ticks()

app.stage.eventMode = 'static'
app.stage.hitArea = new PIXI.Rectangle(0, 0, VIEW_WIDTH, VIEW_HEIGHT)
// app.stage.on('click', () => console.log('click'))

app.stage.addEventListener('mousemove', calc_mouse_position)

app.stage.addEventListener('wheel', (e) => {
  e.preventDefault()

  zoom += e.deltaY * ZOOM_RATE

  if (zoom < MIN_ZOOM) {
    zoom = MIN_ZOOM
  } else if (zoom > MAX_ZOOM) {
    zoom = MAX_ZOOM
  }

  year_span = YEAR_SPAN / zoom

  pixels_per_year = VIEW_WIDTH / year_span

  calc_mouse_position(e)

  draw_decade_ticks()
  draw_year_ticks()

  const mouse_pos_ratio = VIEW_WIDTH / mouse_x
  const x_offset = ((year_span - zoom * year_span) * pixels_per_year) / mouse_pos_ratio
  console.log(`zoom = ${zoom}\n`, `mouse_pos_ratio = ${mouse_pos_ratio}\n`, `x_offset = ${x_offset}\ n`)
  timeline_container.x = x_offset
  start_year = START_YEAR - x_offset / pixels_per_year
  end_year = start_year + year_span
  console.log('start_year, end_year', start_year, end_year)
  // timeline_container.calculateBounds()
})

// app.ticker.add(() => {

// })

function calc_mouse_position(e: MouseEvent) {
  mouse_x = e.x - VIEW_X
  mouse_year = start_year + mouse_x / pixels_per_year
  console.log(mouse_x, mouse_year)
  if (mouse_year_b) mouse_year_b.innerText = Math.floor(mouse_year).toString()
}

function draw_decade_ticks() {
  decade_ticks.clear()
  decade_ticks.lineStyle({ width: 2, color: '#333' })
  for (let year = 0; year <= YEAR_SPAN; year += 10) {
    const x_pos = year * pixels_per_year
    decade_ticks.moveTo(x_pos, VIEW_HEIGHT)
    decade_ticks.lineTo(x_pos, VIEW_HEIGHT - 64)
  }
}

function draw_year_ticks() {
  year_ticks.clear()
  year_ticks.lineStyle({ width: 1, color: '#666' })
  for (let year = 0; year <= YEAR_SPAN; year += 1) {
    const x_pos = year * pixels_per_year
    year_ticks.moveTo(x_pos, VIEW_HEIGHT)
    year_ticks.lineTo(x_pos, VIEW_HEIGHT - 32)
  }
}
