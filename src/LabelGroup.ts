import { Container, Text, TextStyle } from 'pixi.js'
import { fade_in_container, fade_out_container, format_year } from './utils'
import { END_YEAR, START_YEAR, VIEW_X_MARGIN, YEAR_SPAN, TICK_AND_LABEL_CONFIGS, MAX_LABEL_YEAR_SPAN } from './config'

export default class LabelContainer {
  tick_height: number
  label_year_span: number
  pixels_per_year_label_visible: number
  container: Container = new Container()
  labels: { [year: number]: Text } = {}

  constructor(label_year_span:number, pixels_per_year: number, app_height: number) {
    const config = TICK_AND_LABEL_CONFIGS[label_year_span]
    const { pixels_per_year_label_visible, tick_height, label_style } = config

    this.tick_height = tick_height
    this.label_year_span = label_year_span
    this.pixels_per_year_label_visible = pixels_per_year_label_visible
    this.container.alpha = 0
    this.container.eventMode = 'none'

    this.create_labels(pixels_per_year, app_height, label_style)
  }

  add_to(timeline_container: Container) {
    timeline_container.addChild(this.container)
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
        }
      } else {
        // Zoom rate is too fast - just hide the labels immediately so that they don't bunch up
        this.container.alpha = 0
      }
    }
  }

  private create_labels(pixels_per_year: number, app_height: number, label_style: TextStyle) {
    for (let year = START_YEAR; year <= END_YEAR; year += this.label_year_span) {
      if (year % (10 * this.label_year_span) !== 0 || this.label_year_span === MAX_LABEL_YEAR_SPAN) {
        const label = new Text(format_year(year), label_style)
        label.anchor.set(0.5, 1)
        this.container.addChild(label)
        this.labels[year] = label
      }
    }
  }

  private update_label_positions(visible_start_year: number, visible_end_year: number, app_height: number, pixels_per_year: number) {
    for (let year = START_YEAR; year <= YEAR_SPAN; year += this.label_year_span) {
      const label = this.labels[year]
      if (label) {
        if (year >= visible_start_year && year <= visible_end_year) {
          label.x = (year - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
          label.y = app_height - this.tick_height
          label.visible = true
        } else {
          label.visible = false
        }
      }
    }
  }
}