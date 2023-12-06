import { Container, Graphics } from 'pixi.js'
import { END_YEAR, MAX_LABEL_YEAR_SPAN, START_YEAR, TICK_AND_LABEL_CONFIGS, VIEW_X_MARGIN } from './config'
import { fade_in_container, fade_out_container } from './utils'

export default class TickContainer {
  tick_year_span: number
  pixels_per_year_visible: number
  tick_height: number
  tick_color: string
  pixi_graphics: Graphics = new Graphics()
  pixi_container: Container = new Container()

  constructor(tick_year_span: number) {
    const config = TICK_AND_LABEL_CONFIGS[tick_year_span]
    const { pixels_per_year_tick_visible, tick_height, tick_color } = config
    this.tick_year_span = tick_year_span
    this.pixels_per_year_visible = pixels_per_year_tick_visible
    this.tick_height = tick_height
    this.tick_color = tick_color
    this.pixi_graphics.eventMode = 'none'
    this.pixi_container.eventMode = 'none'
    this.pixi_container.addChild(this.pixi_graphics)
    this.pixi_container.alpha = 0
  }

  add_to(timeline_container: Container) {
    timeline_container.addChild(this.pixi_container)
  }

  draw(pixels_per_year: number, app_height: number, wheel_delta_y: number, dt: number) {
    this.pixi_graphics.clear()
    this.pixi_graphics.lineStyle({ width: 2, color: this.tick_color })
    for (let year_count = START_YEAR; year_count <= END_YEAR; year_count += this.tick_year_span) {
      if (year_count % (10 * this.tick_year_span) !== 0 || this.tick_year_span === MAX_LABEL_YEAR_SPAN) {
        const x_pos = (year_count - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
        this.pixi_graphics.moveTo(x_pos, app_height)
        this.pixi_graphics.lineTo(x_pos, app_height - this.tick_height)
      }
    }
    if (pixels_per_year >= this.pixels_per_year_visible) {
      fade_in_container(this.pixi_container, dt)
    } else {
      if (wheel_delta_y > -10) {
        // Zoom rate is slow enough to fade the ticks
        fade_out_container(this.pixi_container, dt)
      } else {
        // Zoom rate is too fast - just hide the ticks immediately so that they don't bunch up
        this.pixi_container.alpha = 0
      }
    }
  }
}