import { ethers } from 'ethers'
import worddict from './worddict.json' assert { type: 'json' }
import WGFactory from '../../truffle/build/contracts/WordGameFactory.json' assert { type: 'json' }
import WordGame from '../../truffle/build/contracts/WordGame.json' assert { type: 'json' }

function handleGame(game) {
  const gameInst = new ethers.Contract(game, WordGame.abi, wallet)
  let usedWords = [gameInst.getLastWord()]
  gameInst.on('Approval', word => {
    if (!usedWords.includes(word) && worddict.includes(word)) {
      usedWords.push(word)
      gameInst.setApproval(true)
    } else gameInst.setApproval(false)
  })
}

let provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545')
await provider.ready

let wallet = new ethers.Wallet(
  'b473e7d69a685e58c83912f2f2f65d40037585ecb5fa5d2f427d7bb7a8644914',
  provider
)

const factoryInst = new ethers.Contract(
  '0x726dAFB3c671EA790b0EbC0a1bA35463c78FDc77',
  WGFactory.abi,
  wallet
)
await factoryInst.deployed()
factoryInst.on('NewGame', handleGame)
