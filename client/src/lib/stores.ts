import { ethers } from 'ethers'
import { derived, readable, writable } from 'svelte/store'
import WordGame from '../../../truffle/build/contracts/WordGame.json'
import WGFactory from '../../../truffle/build/contracts/WordGameFactory.json'

export const ethereum = writable(window.ethereum)
export const deployerAddress = readable(
  '0x79Abe9b660e2a2302c06eF1C13b135C02b7d6Ae8'
)
export const judgeAddress = '0x3dd48efc8ac3E052FA3D7EB65b2517F3929ffA01'
export const currentAddress = writable('')
export const gameAddress = writable('')
export const provider = derived(
  ethereum,
  $ethereum => new ethers.providers.Web3Provider($ethereum)
)
export const factInst = derived(
  [deployerAddress, provider],
  ([$deployerAddress, $provider]) =>
    new ethers.Contract($deployerAddress, WGFactory.abi, $provider.getSigner())
)
export const gameInst = derived(
  [gameAddress, provider],
  ([$gameAddress, $provider]) =>
    new ethers.Contract($gameAddress, WordGame.abi, $provider.getSigner())
)
