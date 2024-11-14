import {
  Color,
  Container,
  Graphics,
  ILineStyleOptions,
  Text,
  TextStyle,
} from 'pixi.js'
import { START_YEAR, VIEW_X_MARGIN, theme } from './config'
import { date_to_float } from './utils'

type EventData = {
  title: string
  date: string
}

const circle_line_style: ILineStyleOptions = {
  color: theme['event-line-color'],
  width: 1,
}

export default class TimelineEvent {
  static fill_color: Color = new Color(theme['event-fill-color'])
  static hover_fill_color: Color = new Color(
    theme['event-hover-fill-color'],
  )
  static focus_fill_color: Color = new Color(
    theme['event-focus-fill-color'],
  )
  title: Text
  date_float: number
  graphics: Graphics = new Graphics()
  size: number = 20
  fill_color: Color = TimelineEvent.fill_color

  constructor(event_data: EventData, timeline_container: Container, graphics: Graphics) {
    this.title = new Text(
      event_data.title,
      new TextStyle({
        fontSize: 12,
      }),
    )
    this.title.anchor.set(0.5, 2)
    timeline_container.addChild(this.title)

    this.date_float = date_to_float(new Date(event_data.date))
    this.graphics = graphics
    this.graphics.eventMode = 'dynamic'
    this.graphics.cursor = 'pointer'
    this.graphics.on('pointerenter', this.handle_pointer_enter, this)
    this.graphics.on('pointerleave', this.handle_pointer_leave, this)
    this.graphics.on('pointerdown', this.handle_pointer_down, this)
    this.graphics.on('pointerup', this.handle_pointer_up, this)
    timeline_container.addChild(this.graphics)
  }

  draw(
    visible_start_year_adjusted: number,
    visible_end_year_adjusted: number,
    pixels_per_year: number,
    app_height: number,
  ) {
    if (
      this.date_float > visible_start_year_adjusted &&
      this.date_float < visible_end_year_adjusted
    ) {
      let x_pos = (this.date_float - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
      if (this.date_float > 1) {
        x_pos -= pixels_per_year
      }
      const y_pos = app_height / 2
      this.graphics
        .lineStyle(circle_line_style)
        .beginFill(this.fill_color)
        // .drawCircle(x_pos, y_pos, this.radius) // For some reason the circle gets distorted when the timeline is zoomed
        .drawRect(x_pos - this.size / 2, y_pos - this.size / 2, this.size, this.size)
        .endFill()
      this.title.x = x_pos
      this.title.y = y_pos
      this.title.visible = true
    } else {
      this.title.visible = false
    }
  }

  private handle_pointer_enter() {
    this.fill_color = TimelineEvent.hover_fill_color
  }

  private handle_pointer_leave() {
    this.fill_color = TimelineEvent.fill_color
  }

  private handle_pointer_down() {
    this.fill_color = TimelineEvent.focus_fill_color
  }

  private handle_pointer_up() {
    this.fill_color = TimelineEvent.hover_fill_color
  }
}
