import { writable } from 'svelte/store'

export const currentAddress = writable('')
export const deployerAddress = writable('')
export const gameAddress = writable('')
export const refresh = writable(false)
