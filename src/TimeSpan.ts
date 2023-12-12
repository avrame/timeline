import {
  Container,
  Graphics,
  ILineStyleOptions,
  Text,
  TextStyle,
} from 'pixi.js'
import { date_to_float } from './utils'
import { START_YEAR, VIEW_X_MARGIN, theme } from './config'
import { Civilization, TimespanData, civ_order } from './data/time-spans'

const height = 42
const x_margin = 2 * 10

export default class TimeSpan {
  static timespan_title_style = new TextStyle({ fontSize: 14, fill: theme['timespan-text-color'] })
  static timespan_line_style: ILineStyleOptions = {
    color: theme['timespan-line-color'],
    width: 1,
  }
  title: Text
  start_date_float: number
  end_date_float: number
  y_pos: number
  container: Container
  graphics: Graphics = new Graphics()
  fill_color: string

  constructor(civilization: Civilization, timespan_data: TimespanData, civ_container: Container) {
    this.container = civ_container
    this.title = new Text(
      timespan_data.title,
      TimeSpan.timespan_title_style,
    )
    this.title.anchor.set(0.5, 0.5)
    this.title.visible = this.title.width < this.graphics.width

    this.start_date_float = date_to_float(new Date(timespan_data.start))
    this.end_date_float = date_to_float(new Date(timespan_data.end))

    this.fill_color = theme[`timespan-${civilization}-fill-color`]
    this.y_pos = civ_order.indexOf(civilization) * height

    this.graphics.addChild(this.title)
    this.container.addChild(this.graphics)
  }

  draw(pixels_per_year: number) {
    this.graphics.clear()

    const start_x_pos =
      (this.start_date_float - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
    const end_x_pos =
      (this.end_date_float - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
    const width = end_x_pos - start_x_pos

    this.graphics
      .lineStyle(TimeSpan.timespan_line_style)
      .beginFill(this.fill_color)
      .drawRoundedRect(0, 0, width, height, 4)
      .endFill()

    this.graphics.setTransform(start_x_pos, this.y_pos)

    this.title.visible = this.title.width + x_margin < this.graphics.width
    this.title.setTransform(width / 2, height / 2)
  }
}
