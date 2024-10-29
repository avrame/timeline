import { Container } from 'pixi.js'

export function format_year(year: number) {
  const era = year < 0 ? 'BCE' : 'CE'
  const absYear = Math.abs(year)
  if (absYear < 10_000) {
    return `${absYear} ${era}`
  }
  if (absYear < 1_000_000) {
    return `${absYear / 1000} kya`
  }
  if (absYear < 1_000_000_000) {
    return `${absYear / 1_000_000} mya`
  }
  return `${absYear / 1_000_000_000} bya`
}

const FADE_SPEED = 0.025
export function fade_in_container(container: Container, dt: number) {
  if (container.alpha < 1) {
    container.alpha += dt * FADE_SPEED
    if (container.alpha > 1) container.alpha = 1
  }
}

export function fade_out_container(container: Container, dt: number): boolean {
  if (container.alpha > 0) {
    container.alpha -= dt * FADE_SPEED
    if (container.alpha < 0) container.alpha = 0
  }
  return container.alpha > 0
}

const MS_IN_YEAR = 365 * 24 * 60 * 60 * 1000
export function date_to_float(date: Date) {
  return 1970 + date.valueOf() / MS_IN_YEAR
}
