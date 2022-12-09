import { writable } from 'svelte/store'

export const currentAddress = writable('')
export const deployerAddress = writable(
  '0x62A757Ce05Ada798f2B07a5e5d87CAAF49CEae86'
)
export const gameAddress = writable('')
export const refresh = writable(false)
