import { ethers } from 'ethers'
import worddict from './worddict.json' assert { type: 'json' }
import WGFactory from '../../truffle/build/contracts/WordGameFactory.json' assert { type: 'json' }
import WordGame from '../../truffle/build/contracts/WordGame.json' assert { type: 'json' }

async function handleGame(game) {
  const gameInst = new ethers.Contract(game, WordGame.abi, wallet)
  let usedWords = [await gameInst.getLastWord()]

  gameInst.on('Approval', async word => {
    if (!usedWords.includes(word) && worddict.includes(word)) {
      usedWords.push(word)
      await gameInst.setApproval(true)
    } else await gameInst.setApproval(false)
  })
}

let provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545')
await provider.ready

const factoryInst = new ethers.Contract(
  '0x45B7f723c4C580Da2600C139e27D72011b569D5E',
  WGFactory.abi,
  provider
)
await factoryInst.deployed()

const wallet = new ethers.Wallet(
  'afa83c99f80e15b04dff28faa71097c0d68507a7b0e84e8293b4041b44b6ae4c',
  provider
)
factoryInst.on('NewGame', handleGame)
