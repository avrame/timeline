import { Container, Text, TextStyle } from 'pixi.js'
import { fade_in_container, fade_out_container, format_year } from './utils'
import { END_YEAR, START_YEAR, VIEW_X_MARGIN, YEAR_SPAN, TICK_AND_LABEL_CONFIGS } from './config'

export default class LabelContainer {
  tick_height: number
  years_level: number
  year_span_label_visible: number
  pixi_container: Container = new Container()
  labels: { [year: number]: Text } = {}

  constructor(years_level:number, pixels_per_year: number, app_height: number, timeline_container: Container) {
    const config = TICK_AND_LABEL_CONFIGS[years_level]
    const { year_span_label_visible, tick_height, label_style } = config

    this.tick_height = tick_height
    this.years_level = years_level
    this.year_span_label_visible = year_span_label_visible
    this.pixi_container.alpha = 0

    this.create_labels(pixels_per_year, app_height, label_style)

    timeline_container.addChild(this.pixi_container)
  }

  update_labels(year_span: number, visible_start_year: number, visible_end_year: number, pixels_per_year: number, app_height: number, dt: number) {
    if (year_span <= this.year_span_label_visible) {
      fade_in_container(this.pixi_container, dt)
      this.update_label_positions(visible_start_year, visible_end_year, app_height, pixels_per_year)
    } else {
      const visible = fade_out_container(this.pixi_container, dt)
      if (visible)
        this.update_label_positions(visible_start_year, visible_end_year, app_height, pixels_per_year)
    }
  }

  private create_labels(pixels_per_year: number, app_height: number, label_style: TextStyle) {
    for (let y = START_YEAR; y <= END_YEAR; y += this.years_level) {
      if (y % (10 * this.years_level) !== 0 || this.years_level === 1000) {
        const label = new Text(format_year(y), label_style)
        label.x = (y - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
        label.y = app_height - this.tick_height
        label.anchor.set(0.5, 1)
        this.pixi_container.addChild(label)
        this.labels[y] = label
      }
    }
  }

  private update_label_positions(visible_start_year: number, visible_end_year: number, app_height: number, pixels_per_year: number) {
    for (let year_count = 0; year_count <= YEAR_SPAN; year_count += this.years_level) {
      const year = year_count + START_YEAR
      const label = this.labels[year]
      if (label) {
        if (year >= visible_start_year && year <= visible_end_year) {
          label.x = year_count * pixels_per_year + VIEW_X_MARGIN
          label.y = app_height - this.tick_height
          label.visible = true
        } else {
          label.visible = false
        }
      }
    }
  }
}