const THEME_VAR_NAMES: string[] = [
  'timeline-bg-color',
  'year-tick-color',
  'decade-tick-color',
  'century-tick-color',
  'millennium-tick-color',
  'event-circle-line-color',
  'event-circle-fill-color',
  'event-circle-hover-fill-color',
  'event-circle-focus-fill-color',
  'timespan-text-color',
  'timespan-line-color',
  'timespan-greece-fill-color',
  'timespan-greece2-fill-color',
  'timespan-babylonian-fill-color',
  'timespan-roman-fill-color',
  'timespan-east-roman-fill-color',
  'timespan-ottoman-fill-color',
  'timespan-china-fill-color',
  'timespan-china2-fill-color',
  'timespan-china3-fill-color',
]

export function get_theme() {
  const theme: { [prop: string]: string } = {}
  for (const VAR_NAME of THEME_VAR_NAMES) {
    theme[VAR_NAME] = get_css_var(VAR_NAME)
  }
  return theme
}

function get_css_var(css_var_name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(
    `--${css_var_name}`,
  )
}
