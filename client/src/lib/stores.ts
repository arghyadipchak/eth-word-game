import { writable } from 'svelte/store'

export const currentAddress = writable('')
export const deployerAddress = writable(
  '0x726dAFB3c671EA790b0EbC0a1bA35463c78FDc77'
)
export const gameAddress = writable('')
export const refresh = writable(false)
export const plays = writable([])
export const validGame = writable(false)
export const playerNames = writable({})
