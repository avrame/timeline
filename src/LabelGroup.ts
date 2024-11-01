import { Container, Text, TextStyle } from 'pixi.js'
import { fade_in_container, fade_out_container, format_year } from './utils'
import { START_YEAR, VIEW_X_MARGIN, TICK_AND_LABEL_CONFIGS, MAX_LABEL_YEAR_SPAN, END_YEAR } from './config'

export default class LabelContainer {
  tick_height: number
  label_year_span: number
  pixels_per_year_label_visible: number
  container: Container = new Container()
  labels: { [year: number]: Text } = {}
  label_style: TextStyle
  constructor(label_year_span: number) {
    const config = TICK_AND_LABEL_CONFIGS[label_year_span]
    const { pixels_per_year_label_visible, tick_height, label_style } = config

    this.tick_height = tick_height
    this.label_year_span = label_year_span
    this.label_style = label_style
    this.pixels_per_year_label_visible = pixels_per_year_label_visible
    this.container.alpha = 0
    this.container.eventMode = 'none'
  }

  get_draw_threshold() {
    return this.pixels_per_year_label_visible / 2
  }

  add_to(timeline_container: Container) {
    timeline_container.addChild(this.container)
  }

  create_labels(visible_start_year: number, visible_end_year: number) {
    const start_year = Math.round(Math.floor(visible_start_year / this.label_year_span)) * this.label_year_span
    const end_year = Math.round(Math.ceil(visible_end_year / this.label_year_span)) * this.label_year_span
    for (let year = start_year; year <= end_year; year += this.label_year_span) {
      if (year > END_YEAR) {
        continue
      }
      const year_adjusted = year === 0 ? year + 1 : year
      if ((year_adjusted % (10 * this.label_year_span) !== 0 && year_adjusted !== 1) || this.label_year_span === MAX_LABEL_YEAR_SPAN) {
        if (this.labels[year_adjusted]) {
          continue
        }
        const label = new Text(format_year(year_adjusted), this.label_style)
        label.anchor.set(0.5, 1)
        this.container.addChild(label)
        this.labels[year_adjusted] = label
      }
    }
  }

  remove_labels() {
    for (const label of Object.values(this.labels)) {
      this.container.removeChild(label)
    }
    this.labels = {}
  }

  update_labels(visible_start_year: number, visible_end_year: number, pixels_per_year: number, app_height: number, wheel_delta_y:number, dt: number) {
    if (pixels_per_year >= this.pixels_per_year_label_visible) {
      fade_in_container(this.container, dt)
      this.update_label_positions(visible_start_year, visible_end_year, app_height, pixels_per_year)
    } else {
      if (wheel_delta_y > -10) {
        // Zoom rate is slow enough to fade the labels
        const visible = fade_out_container(this.container, dt)
        if (visible) {
          this.update_label_positions(visible_start_year, visible_end_year, app_height, pixels_per_year)
        } else {
          this.remove_labels()
        }
      } else {
        // Zoom rate is too fast - just hide the labels immediately so that they don't bunch up
        this.container.alpha = 0
        this.remove_labels()
      }
    }
  }

  private update_label_positions(visible_start_year: number, visible_end_year: number, app_height: number, pixels_per_year: number) {
    const start_year = Math.round(Math.floor(visible_start_year / this.label_year_span)) * this.label_year_span
    const end_year = Math.round(Math.ceil(visible_end_year / this.label_year_span)) * this.label_year_span
    for (let year = start_year; year <= end_year; year += this.label_year_span) {
      const year_adjusted = year === 0 ? year + 1 : year
      const label = this.labels[year_adjusted]
      if (label) {
        if (year_adjusted >= visible_start_year && year_adjusted <= visible_end_year) {
          switch(true) {
          case year_adjusted < 1:
            label.x = (year_adjusted - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
            break
          case year_adjusted === 1:
            label.x = (year - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
            break
          default:
            label.x = (year - 1 - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
          }
          label.y = app_height - this.tick_height
          label.visible = true
        } else {
          label.visible = false
        }
      }
    }
  }
}