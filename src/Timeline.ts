import { Application, Container, Rectangle } from 'pixi.js'
import { START_YEAR, theme } from './config'
import LabelGroup from './LabelGroup'
import TickGroup from './TickGroup'
import TimelineEvent from './TimelineEvent'
import { TimelineEventData } from './data/events'
import TimeSpan from './TimeSpan'
import { CivTimespans, Civilization } from './data/time-spans'
import { format_year } from './utils'

interface TimelineData {
  events: TimelineEventData[]
  civ_timespans: CivTimespans
}

interface TimelineConfig {
  view_x_margin: number
  max_label_year_span: number
  zoom_rate: number
  min_zoom: number
  max_zoom: number
}

export default class Timeline {
  readonly start_year: number
  readonly end_year: number
  readonly year_span: number
  readonly zoom_rate: number
  readonly min_zoom: number
  readonly max_zoom: number
  timeline_div?: HTMLElement
  mouse_year_b?: HTMLElement
  app: Application
  timeline_container: Container = new Container()
  label_groups: LabelGroup[] = []
  tick_groups: TickGroup[] = []
  event_objects: TimelineEvent[] = []
  timespan_objects: TimeSpan[] = []
  view_x_pos: number
  visible_start_year: number
  visible_end_year: number
  visible_year_span: number
  pixels_per_year: number
  zoom: number = 1.0
  zoom_mult: number = 1
  global_mouse_x: number
  mouse_x: number = 0
  mouse_year: number = 0
  wheel_delta_y = 0
  view_x_margin: number

  constructor(start_year: number, end_year: number, data: TimelineData, config: Readonly<TimelineConfig>) {
    const { view_x_margin, max_label_year_span, zoom_rate, min_zoom, max_zoom } = config
    this.view_x_margin = view_x_margin
    this.zoom_rate = zoom_rate
    this.min_zoom = min_zoom
    this.max_zoom = max_zoom

    const { events, civ_timespans } = data
    this.timeline_div = document.getElementById('timeline') ?? undefined
    this.mouse_year_b = document.getElementById('mouse_year') ?? undefined

    this.app = new Application({
      background: theme['timeline-bg-color'],
      resizeTo: this.timeline_div,
      antialias: true,
    })
    const { width: view_width, height: view_height } = this.app.view

    this.view_x_pos = this.timeline_div?.getBoundingClientRect().x ?? 0

    this.start_year = start_year
    this.end_year = end_year
    this.year_span = end_year - start_year
    this.visible_start_year = start_year
    this.visible_end_year = end_year
    this.visible_year_span = end_year - start_year
    this.pixels_per_year = (view_width - 2 * view_x_margin) / this.visible_year_span
    this.global_mouse_x = view_width / 2

    this.timeline_div?.appendChild(this.app.view as unknown as Node)

    this.init_labels_and_ticks(max_label_year_span)
    this.init_events(events)
    this.init_timespans(civ_timespans)

    this.app.stage.addChild(this.timeline_container)
    this.app.stage.eventMode = 'static'
    this.app.stage.hitArea = new Rectangle(0, 0, view_width, view_height)

    window.addEventListener('resize', this.handle_window_resize)
    this.app.stage.addEventListener('pointermove', this.handle_pointermove)
    this.app.stage.addEventListener('wheel', this.handle_mousewheel)
  }

  private init_labels_and_ticks(max_label_year_span: number) {
    // Create arrays of label and tick containers
    for (let i = 1; i <= max_label_year_span; i *= 10) {
      const label_group = new LabelGroup(i)
      label_group.add_to(this.timeline_container)
      this.label_groups.push(label_group)

      const tick_group = new TickGroup(i)
      tick_group.add_to(this.timeline_container)
      this.tick_groups.push(tick_group)
    }
    this.create_labels()
  }

  private create_labels() {
    for (const label_group of this.label_groups) {
      if (this.pixels_per_year >= label_group.get_draw_threshold()) {
        label_group.create_labels(this.visible_start_year, this.visible_end_year)
      }
    }
  }

  start() {
    this.app.ticker.add(this.update.bind(this))
  }

  private update = (dt: number) => {
    this.mouse_x = this.global_mouse_x - this.view_x_pos - this.view_x_margin
    this.mouse_year = this.visible_start_year + this.mouse_x / this.pixels_per_year
    if (this.mouse_year >= 0) this.mouse_year += 1
    if (this.mouse_year_b) this.mouse_year_b.innerText = format_year(this.mouse_year).toString()
    this.visible_start_year = this.start_year - this.timeline_container.x / this.pixels_per_year
    this.visible_end_year = this.visible_start_year + this.visible_year_span
    if (this.visible_end_year >= 0) this.visible_end_year += 1

    const years_in_margin = this.view_x_margin / this.pixels_per_year
    const visible_start_year_adjusted = Math.max(this.visible_start_year - years_in_margin, START_YEAR)
    const visible_end_year_adjusted = this.visible_end_year + years_in_margin

    this.draw_ticks(dt)
    this.update_label_positions(
      dt,
      visible_start_year_adjusted,
      visible_end_year_adjusted,
    )
    this.draw_events(visible_start_year_adjusted, visible_end_year_adjusted)
    this.draw_timespans()
  }

  private handle_window_resize = () => {
    this.pixels_per_year = this.calc_pixels_per_year()
  }

  private handle_pointermove = (e: MouseEvent) => {
    this.global_mouse_x = e.x
  }

  private handle_mousewheel = (e: WheelEvent) => {
    e.preventDefault()

    this.wheel_delta_y = e.deltaY

    this.global_mouse_x = e.x
    this.calc_zoom()
    this.visible_year_span = this.year_span / this.zoom
    this.pixels_per_year = this.calc_pixels_per_year()
    // console.log(this.pixels_per_year)
    this.create_labels()
    
    // Prevents too much horizontal sliding when zooming
    const wheel_delta_x = this.wheel_delta_y > 2 ? 0 : e.deltaX
    let x_offset = -((this.mouse_x - this.timeline_container.x) * this.zoom_mult - this.mouse_x) - wheel_delta_x
    
    if (x_offset > 0 || this.zoom === 1) {
      x_offset = 0
    }

    this.timeline_container.x = x_offset
  }

  private init_events(events: TimelineEventData[]) {
    for (const event_data of events) {
      const event_obj = new TimelineEvent(event_data, this.timeline_container)
      this.event_objects.push(event_obj)
    }
  }

  private init_timespans(civ_timespans: CivTimespans) {
    for (const civilization in civ_timespans) {
      const civ = civilization as Civilization
      const civ_container = new Container()
      for (const timespan_data of civ_timespans[civ]) {
        const timespan_obj = new TimeSpan(civ, timespan_data, civ_container)
        this.timespan_objects.push(timespan_obj)
      }
      this.timeline_container.addChild(civ_container)
    }
  }

  private calc_pixels_per_year() {
    return (this.app.view.width - 2 * this.view_x_margin) / this.visible_year_span
  }

  private calc_zoom() {
    const zoom_delta = this.wheel_delta_y * this.zoom_rate
    const new_zoom = this.zoom * (1 + zoom_delta)
    this.zoom_mult = 1
    if (new_zoom < this.min_zoom) {
      this.zoom = this.min_zoom
    } else if (new_zoom > this.max_zoom) {
      this.zoom_mult = this.max_zoom / this.zoom
      this.zoom = this.max_zoom
    } else {
      this.zoom_mult = new_zoom / this.zoom
      this.zoom = new_zoom
    }
  }

  private draw_ticks(dt: number) {
    for (const tick_container of this.tick_groups) {
      if (this.pixels_per_year >= tick_container.get_draw_threshold()) {
        tick_container.draw(this.pixels_per_year, this.visible_start_year, this.visible_end_year, this.app.view.height, this.wheel_delta_y, dt)
      }
    }
  }

  private update_label_positions(
    dt: number,
    visible_start_year_adjusted: number,
    visible_end_year_adjusted: number,
  ) {
    for (const label_container of this.label_groups) {
      label_container.update_labels(
        visible_start_year_adjusted,
        visible_end_year_adjusted,
        this.pixels_per_year,
        this.app.view.height,
        this.wheel_delta_y,
        dt,
      )
    }
  }

  private draw_events(
    visible_start_year_adjusted: number,
    visible_end_year_adjusted: number,
  ) {
    for (const event_obj of this.event_objects) {
      event_obj.draw(
        visible_start_year_adjusted,
        visible_end_year_adjusted,
        this.pixels_per_year,
        this.app.view.height,
      )
    }
  }

  private draw_timespans() {
    for (const timespan_obj of this.timespan_objects) {
      timespan_obj.draw(this.pixels_per_year, this.app.view.width)
    }
  }
}