import { writable } from 'svelte/store'

export const currentAddress = writable('')
export const deployerAddress = writable(
  '0x2C68D9df540F92728F272530724d458da049f275'
)
export const gameAddress = writable('')
export const refresh = writable(false)
export const plays = writable([])
export const validGame = writable(false)
