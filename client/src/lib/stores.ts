import { ethers } from 'ethers'
import { derived, readable, writable } from 'svelte/store'
import WordGame from '../../../truffle/build/contracts/WordGame.json'
import WGFactory from '../../../truffle/build/contracts/WordGameFactory.json'

export const ethereum = writable(window.ethereum)
export const deployerAddress = readable(
  '0x8faeB2009FF74B5b2bA6876582a0E2a885bAdB43'
)
export const judgeAddress = readable(
  '0x750ED35F3fEF98C1E08Ed603E1849591cC5E3f6e'
)
export const currentAddress = writable('')
export const gameAddress = writable('')
export const provider = derived(
  ethereum,
  $ethereum => new ethers.providers.Web3Provider($ethereum)
)
export const factInst = derived(
  [deployerAddress, provider],
  ([$deployerAddress, $provider]) =>
    new ethers.Contract($deployerAddress, WGFactory.abi, $provider)
)
export const gameInst = derived(
  [gameAddress, provider],
  ([$gameAddress, $provider]) =>
    new ethers.Contract($gameAddress, WordGame.abi, $provider)
)
