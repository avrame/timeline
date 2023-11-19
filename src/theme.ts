const THEME_VAR_NAMES: string[] = ['timeline-bg-color', 'year-tick-color', 'decade-tick-color']

export function get_theme() {
  const theme: { [prop: string]: string } = {}
  for (const VAR_NAME of THEME_VAR_NAMES) {
    theme[VAR_NAME] = get_css_var(VAR_NAME)
  }
  return theme
}

function get_css_var(css_var_name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${css_var_name}`)
}