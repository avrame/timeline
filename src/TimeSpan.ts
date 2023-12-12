import {
  BitmapFont,
  BitmapText,
  Container,
  Graphics,
  ILineStyleOptions,
} from 'pixi.js'
import { date_to_float } from './utils'
import { START_YEAR, VIEW_X_MARGIN, theme } from './config'
import { Civilization, TimespanData, civ_order } from './data/time-spans'

const height = 42
const x_margin = 2 * 10


const font_name = 'TimespanFont'
BitmapFont.from(font_name, {
  fontSize: 16,
  fontFamily: ['Seravek', 'Gill Sans Nova', 'Ubuntu', 'Calibri', 'DejaVu Sans', 'source-sans-pro', 'sans-serif'],
  fill: theme['timespan-text-color'],
  dropShadow: true,
  dropShadowColor: '#333',
  // dropShadowBlur: 2,
  dropShadowAngle: Math.PI / 6,
  dropShadowAlpha: 0.8,
  dropShadowDistance: 2,
})

export default class TimeSpan {
  static timespan_line_style: ILineStyleOptions = {
    color: theme['timespan-line-color'],
    width: 1,
  }
  title: BitmapText
  start_date_float: number
  end_date_float: number
  y_pos: number
  civ_container: Container
  container: Container = new Container()
  graphics: Graphics = new Graphics()
  fill_color: string

  constructor(civilization: Civilization, timespan_data: TimespanData, civ_container: Container) {
    this.civ_container = civ_container
    this.title = new BitmapText(
      timespan_data.title,
      { fontName:font_name }
    )
    this.title.anchor.set(0.5, 0.5)

    this.start_date_float = date_to_float(new Date(timespan_data.start))
    this.end_date_float = date_to_float(new Date(timespan_data.end))

    this.fill_color = theme[`timespan-${civilization}-fill-color`]
    this.y_pos = civ_order.indexOf(civilization) * height

    this.container.addChild(this.graphics, this.title)
    this.civ_container.addChild(this.container)
  }

  draw(pixels_per_year: number, app_width: number) {
    this.graphics.clear()

    const start_x_pos =
      (this.start_date_float - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
    const end_x_pos =
      (this.end_date_float - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
    const width = end_x_pos - start_x_pos

    this.graphics
      .beginFill(this.fill_color)
      .lineStyle(TimeSpan.timespan_line_style)
      .drawRoundedRect(0, 0, width, height, 4)
      .endFill()

    this.container.setTransform(start_x_pos, this.y_pos)
    const graphics_global_pos = this.container.getGlobalPosition()

    this.title.visible = this.title.width + x_margin < this.container.width
    this.title.setTransform(width / 2, height / 2)
    const text_global_pos = this.title.getGlobalPosition()
    const title_cutoff = this.title.width / 2 + 10
    if (text_global_pos.x < title_cutoff && width + graphics_global_pos.x > 0) {
      this.title.setTransform(-graphics_global_pos.x + title_cutoff, height / 2)
    } else if (text_global_pos.x > app_width - title_cutoff && graphics_global_pos.x < app_width - this.title.width - 10) {
      this.title.setTransform(app_width - graphics_global_pos.x - title_cutoff, height / 2)
    }
  }
}
