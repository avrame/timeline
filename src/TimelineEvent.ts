import {
  Circle,
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
  color: theme['event-circle-line-color'],
  width: 1,
}

export default class TimelineEvent {
  static circle_radius: number = 10
  static circle_hover_radius: number = 12
  static circle_fill_color: Color = new Color(theme['event-circle-fill-color'])
  static circle_hover_fill_color: Color = new Color(
    theme['event-circle-hover-fill-color'],
  )
  static circle_focus_fill_color: Color = new Color(
    theme['event-circle-focus-fill-color'],
  )
  title: Text
  date_float: number
  pixi_graphics: Graphics = new Graphics()
  hit_area: Circle = new Circle()
  radius: number = TimelineEvent.circle_radius
  fill_color: Color = TimelineEvent.circle_fill_color

  constructor(event_data: EventData, timeline_container: Container) {
    this.title = new Text(
      event_data.title,
      new TextStyle({
        fontSize: 12,
      }),
    )
    this.title.anchor.set(0.5, 2)
    timeline_container.addChild(this.title)

    this.date_float = date_to_float(new Date(event_data.date))
    this.hit_area.radius = TimelineEvent.circle_radius
    this.pixi_graphics.eventMode = 'dynamic'
    this.pixi_graphics.hitArea = this.hit_area
    this.pixi_graphics.cursor = 'pointer'
    this.pixi_graphics.on('pointerenter', this.handle_pointer_enter, this)
    this.pixi_graphics.on('pointerleave', this.handle_pointer_leave, this)
    this.pixi_graphics.on('pointerdown', this.handle_pointer_down, this)
    this.pixi_graphics.on('pointerup', this.handle_pointer_up, this)
    timeline_container.addChild(this.pixi_graphics)
  }

  draw(
    visible_start_year_adjusted: number,
    visible_end_year_adjusted: number,
    pixels_per_year: number,
    app_height: number,
  ) {
    this.pixi_graphics.clear()
    if (
      this.date_float > visible_start_year_adjusted &&
      this.date_float < visible_end_year_adjusted
    ) {
      const x_pos =
        (this.date_float - START_YEAR) * pixels_per_year + VIEW_X_MARGIN
      const y_pos = app_height / 2
      this.pixi_graphics
        .lineStyle(circle_line_style)
        .beginFill(this.fill_color)
        .drawCircle(x_pos, y_pos, this.radius)
        .endFill()
      this.hit_area.x = x_pos
      this.hit_area.y = y_pos
      this.title.x = x_pos
      this.title.y = y_pos
      this.title.visible = true
    } else {
      this.title.visible = false
    }
  }

  private handle_pointer_enter() {
    this.fill_color = TimelineEvent.circle_hover_fill_color
    this.radius = TimelineEvent.circle_hover_radius
  }

  private handle_pointer_leave() {
    this.fill_color = TimelineEvent.circle_fill_color
    this.radius = TimelineEvent.circle_radius
  }

  private handle_pointer_down() {
    this.fill_color = TimelineEvent.circle_focus_fill_color
  }

  private handle_pointer_up() {
    this.fill_color = TimelineEvent.circle_hover_fill_color
  }
}
