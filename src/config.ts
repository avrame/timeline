import { TextStyle } from "pixi.js"
import { get_theme } from "./theme"

export const VIEW_X_MARGIN = 35

export const theme = get_theme()

export const now = new Date()
export const START_YEAR = 0
export const END_YEAR = now.getFullYear()
export const YEAR_SPAN = END_YEAR - START_YEAR

export const MIN_ZOOM = 1
export const MAX_ZOOM = YEAR_SPAN / 2
export const ZOOM_RATE = 0.005

export const MILLENNIUM_TICK_HEIGHT = 128
export const CENTURY_TICK_HEIGHT = 96
export const DECADE_TICK_HEIGHT = 64
export const YEAR_TICK_HEIGHT = 32

export const YEAR_SPAN_MILLENNIUM_TICK_VISIBLE = 5000
export const YEAR_SPAN_CENTURY_TICK_VISIBLE = 2500
export const YEAR_SPAN_DECADE_TICK_VISIBLE = 1000
export const YEAR_SPAN_YEAR_TICK_VISIBLE = 250

export const millennium_text_style = new TextStyle({
  fontSize: 16,
})
export const century_text_style = new TextStyle({
  fontSize: 14,
})
export const decade_text_style = new TextStyle({
  fontSize: 12,
})
export const year_text_style = new TextStyle({
  fontSize: 10,
})

type LabelConfig = {
  tick_height: number,
  label_style: TextStyle,
  year_span_label_visible: number
  year_span_tick_visible: number
  tick_color: string
}
export const TICK_AND_LABEL_CONFIGS: {[year_span: number]: LabelConfig} = {
  1000: {
    tick_height: MILLENNIUM_TICK_HEIGHT,
    label_style: millennium_text_style,
    year_span_label_visible: 5000,
    year_span_tick_visible: YEAR_SPAN_MILLENNIUM_TICK_VISIBLE,
    tick_color: theme['--millennium-tick-color'],
  },
  100: {
    tick_height: CENTURY_TICK_HEIGHT,
    label_style: century_text_style,
    year_span_label_visible: 2500,
    year_span_tick_visible: YEAR_SPAN_CENTURY_TICK_VISIBLE,
    tick_color: theme['--century-tick-color'],
  },
  10: {
    tick_height: DECADE_TICK_HEIGHT,
    label_style: decade_text_style,
    year_span_label_visible: 275,
    year_span_tick_visible: YEAR_SPAN_DECADE_TICK_VISIBLE,
    tick_color: theme['--decade-tick-color'],
  },
  1: {
    tick_height: YEAR_TICK_HEIGHT,
    label_style: year_text_style,
    year_span_label_visible: 35,
    year_span_tick_visible: YEAR_SPAN_YEAR_TICK_VISIBLE,
    tick_color: theme['--year-tick-color'],
  }
}