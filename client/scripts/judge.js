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

const factoryInst = new ethers.Contract(
  '0x8faeB2009FF74B5b2bA6876582a0E2a885bAdB43',
  WGFactory.abi,
  new ethers.Wallet(
    'b473e7d69a685e58c83912f2f2f65d40037585ecb5fa5d2f427d7bb7a8644914',
    provider
  )
)
await factoryInst.deployed()
factoryInst.on('NewGame', handleGame)
