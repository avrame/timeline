import './style.css'
import '@pixi/graphics-extras'
import Timeline from './Timeline'
import { END_YEAR, MAX_LABEL_YEAR_SPAN, MAX_ZOOM, MIN_ZOOM, START_YEAR, VIEW_X_MARGIN, ZOOM_RATE } from './config'
import events from './data/events'
import { civ_timespans } from './data/time-spans'

const timeline = new Timeline(START_YEAR, END_YEAR, { events, civ_timespans }, {
  view_x_margin: VIEW_X_MARGIN,
  max_label_year_span: MAX_LABEL_YEAR_SPAN,
  zoom_rate: ZOOM_RATE,
  min_zoom: MIN_ZOOM,
  max_zoom: MAX_ZOOM,
})

timeline.start()