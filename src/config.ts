import { TextStyle } from "pixi.js"

export const VIEW_X_MARGIN = 35

export const now = new Date()
export const START_YEAR = 0
export const END_YEAR = now.getFullYear()
export const YEAR_SPAN = END_YEAR - START_YEAR

export const MIN_ZOOM = 1
export const MAX_ZOOM = YEAR_SPAN / 2
export const ZOOM_RATE = 0.005

export const YEAR_TICK_HEIGHT = 32
export const DECADE_TICK_HEIGHT = 64
export const CENTURY_TICK_HEIGHT = 96
export const MILLENNIUM_TICK_HEIGHT = 128

export const YEAR_SPAN_MILLENNIUM_LABEL_VISIBLE = 5000
export const YEAR_SPAN_MILLENNIUM_TICK_VISIBLE = 5000
export const YEAR_SPAN_CENTURY_TICK_VISIBLE = 2500
export const YEAR_SPAN_CENTURY_LABEL_VISIBLE = 2500
export const YEAR_SPAN_DECADE_TICK_VISIBLE = 1000
export const YEAR_SPAN_DECADE_LABEL_VISIBLE = 275
export const YEAR_SPAN_YEAR_TICK_VISIBLE = 250
export const YEAR_SPAN_YEAR_LABEL_VISIBLE = 35

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