import { Container, Graphics } from "pixi.js";
import { START_YEAR, TICK_AND_LABEL_CONFIGS, VIEW_X_MARGIN } from "./config";

export default class TickContainer {
  tick_year_span: number
  pixels_per_year_visible: number
  tick_height: number
  tick_color: string
  pixi_graphics: Graphics = new Graphics()

  constructor(tick_year_span: number) {
    const config = TICK_AND_LABEL_CONFIGS[tick_year_span]
    const { pixels_per_year_tick_visible, tick_height, tick_color } = config
    this.tick_year_span = tick_year_span
    this.pixels_per_year_visible = pixels_per_year_tick_visible
    this.tick_height = tick_height
    this.tick_color = tick_color
  }

  add_to(timeline_container: Container) {
    timeline_container.addChild(this.pixi_graphics)
  }

  draw(start_year: number, year_span: number, pixels_per_year: number, app_height: number) {
    if (pixels_per_year >= this.pixels_per_year_visible) {
      this.pixi_graphics.clear()
      this.pixi_graphics.lineStyle({ width: 1, color: this.tick_color })
      const start_year_span = Math.floor(start_year / this.tick_year_span) * this.tick_year_span
      const start = Math.floor(start_year_span - START_YEAR)
      const end = Math.ceil(start_year_span + year_span + this.tick_year_span)
      for (let year_count = start; year_count <= end; year_count += this.tick_year_span) {
        if (year_count % (10 * this.tick_year_span) !== 0 || this.tick_year_span === 1000) {
          const x_pos = year_count * pixels_per_year + VIEW_X_MARGIN
          this.pixi_graphics.moveTo(x_pos, app_height)
          this.pixi_graphics.lineTo(x_pos, app_height - this.tick_height)
        }
      }
    } else {
      this.pixi_graphics.clear()
    }
  }
}