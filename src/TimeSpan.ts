import {
  Container,
  Graphics,
  ILineStyleOptions,
  Text,
  TextStyle,
} from 'pixi.js'
import { date_to_float } from './utils'
import { START_YEAR, VIEW_X_MARGIN, theme } from './config'

type TimespanData = {
  title: string
  category: string
  start: string
  end: string
}

const timespan_line_style: ILineStyleOptions = {
  color: theme['timespan-line-color'],
  width: 1,
}

const category_order: string[] = [
  'greece',
  'greece2',
  'babylonian',
  'roman',
  'east-roman',
  'ottoman',
  'china',
  'china2',
  'china3',
]
const height = 42
const x_margin = 2 * 10

export default class TimeSpan {
  title: Text
  start_date_float: number
  end_date_float: number
  y_pos: number
  container: Container = new Container()
  pixi_graphics: Graphics = new Graphics()
  fill_color: string

  constructor(timespan_data: TimespanData, timeline_container: Container) {
    this.title = new Text(
      timespan_data.title,
      new TextStyle({ fontSize: 14, fill: theme['timespan-text-color'] }),
    )
    this.title.anchor.set(0.5, 0.5)
    this.title.visible = this.title.width < this.container.width

    this.start_date_float = date_to_float(new Date(timespan_data.start))
    this.end_date_float = date_to_float(new Date(timespan_data.end))

    this.fill_color = theme[`timespan-${timespan_data.category}-fill-color`]
    this.y_pos = category_order.indexOf(timespan_data.category) * height

    this.container.addChild(this.pixi_graphics)
    this.container.addChild(this.title)
    timeline_container.addChild(this.container)
  }

  draw(pixels_per_year: number) {
    this.pixi_graphics.clear()

    const start_x_pos =
      (this.start_date_float - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
    const end_x_pos =
      (this.end_date_float - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
    const width = end_x_pos - start_x_pos

    this.pixi_graphics
      .lineStyle(timespan_line_style)
      .beginFill(this.fill_color)
      .drawRoundedRect(0, 0, width, height, 4)
      .endFill()

    this.title.x = width / 2
    this.title.y = height / 2

    this.title.visible = this.title.width + x_margin < this.container.width

    this.container.x = start_x_pos
    this.container.y = this.y_pos
  }
}
