import { Container, Text, TextStyle } from 'pixi.js'
import { fade_in_container, fade_out_container, format_year } from './utils'
import { END_YEAR, START_YEAR, VIEW_X_MARGIN, YEAR_SPAN } from './config'

type ConstructorOptions = {
  label_year_span: number,
  pixels_per_year: number,
  app_height: number,
  tick_height: number,
  label_style: TextStyle,
  timeline_container: Container
  year_span_label_visible: number
}

export default class LabelContainer {
  label_year_span: number
  year_span_label_visible: number
  pixi_container: Container = new Container()
  labels: { [year: number]: Text } = {}

  constructor({
    label_year_span,
    pixels_per_year,
    app_height,
    tick_height,
    label_style,
    timeline_container,
    year_span_label_visible
  }: ConstructorOptions) {
    this.label_year_span = label_year_span
    this.year_span_label_visible = year_span_label_visible
    this.pixi_container.alpha = 0

    this.create_labels(pixels_per_year, app_height, tick_height, label_style)

    timeline_container.addChild(this.pixi_container)
  }

  update_labels(year_span: number, visible_start_year: number, visible_end_year: number, pixels_per_year: number, dt: number) {
    if (year_span <= this.year_span_label_visible) {
      fade_in_container(this.pixi_container, dt)
      this.update_label_positions(visible_start_year, visible_end_year, pixels_per_year)
    } else {
      const visible = fade_out_container(this.pixi_container, dt)
      if (visible)
        this.update_label_positions(visible_start_year, visible_end_year, pixels_per_year)
    }
  }

  private create_labels(pixels_per_year: number, app_height: number, tick_height: number, label_style: TextStyle) {
    for (let y = START_YEAR; y <= END_YEAR; y += this.label_year_span) {
      if (y % (10 * this.label_year_span) !== 0 || this.label_year_span === 1000) {
        const label = new Text(format_year(y), label_style)
        label.x = (y - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
        label.y = app_height - tick_height
        label.anchor.set(0.5, 1)
        this.pixi_container.addChild(label)
        this.labels[y] = label
      }
    }
  }

  private update_label_positions(visible_start_year: number, visible_end_year: number, pixels_per_year: number) {
    for (let year_count = 0; year_count <= YEAR_SPAN; year_count += this.label_year_span) {
      const year = year_count + START_YEAR
      const label = this.labels[year]
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
}