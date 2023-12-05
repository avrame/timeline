import { TextStyle } from "pixi.js"
import { get_theme } from "./theme"

export const VIEW_X_MARGIN = 50

export const theme = get_theme()

export const now = new Date()
export const START_YEAR = -10000
export const END_YEAR = now.getFullYear()
export const YEAR_SPAN = END_YEAR - START_YEAR
export const MAX_LABEL_YEAR_SPAN = 1000

export const MIN_ZOOM = 1
export const MAX_ZOOM = YEAR_SPAN / 5
export const ZOOM_RATE = 0.005

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
  pixels_per_year_label_visible: number
  pixels_per_year_tick_visible: number
  tick_color: string
}
export const TICK_AND_LABEL_CONFIGS: {[year_span: number]: LabelConfig} = {
  1000: {
    tick_height: 128,
    label_style: millennium_text_style,
    pixels_per_year_label_visible: 0,
    pixels_per_year_tick_visible: 0,
    tick_color: theme['--millennium-tick-color'],
  },
  100: {
    tick_height: 96,
    label_style: century_text_style,
    pixels_per_year_label_visible: 0.75,
    pixels_per_year_tick_visible: 0.25,
    tick_color: theme['--century-tick-color'],
  },
  10: {
    tick_height: 64,
    label_style: decade_text_style,
    pixels_per_year_label_visible: 6,
    pixels_per_year_tick_visible: 1.5,
    tick_color: theme['--decade-tick-color'],
  },
  1: {
    tick_height: 32,
    label_style: year_text_style,
    pixels_per_year_label_visible: 58,
    pixels_per_year_tick_visible: 10,
    tick_color: theme['--year-tick-color'],
  }
}