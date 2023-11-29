import { Container } from "pixi.js"

const FADE_SPEED = 0.05

export function format_year(year: number) {
  const era = year < 0 ? 'BCE' : 'CE'
  return `${Math.abs(Math.floor(year))} ${era}`
}

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