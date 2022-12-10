import { writable } from 'svelte/store'

export const currentAddress = writable('')
export const deployerAddress = writable(
  '0x4f1372e01E745860d99c42Fbba18926998dd5806'
)
export const gameAddress = writable('')
export const refresh = writable(false)
export const plays = writable([])
export const validGame = writable(false)
export const playerNames = writable({})
