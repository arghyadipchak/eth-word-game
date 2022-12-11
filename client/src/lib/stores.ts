import { writable } from 'svelte/store'

export const currentAddress = writable('')
export const deployerAddress = writable(
  '0x360B1B644c18080b862B7fa3762247558a7eDE7B'
)
export const gameAddress = writable('')
export const judgeAddress = '0x750ED35F3fEF98C1E08Ed603E1849591cC5E3f6e'
export const plays = writable([])
export const validGame = writable(false)
export const playerNames = writable({})
export const spectator = writable(false)
