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

const wallet =  new ethers.Wallet(
  'afa83c99f80e15b04dff28faa71097c0d68507a7b0e84e8293b4041b44b6ae4c',
  provider
)

const factoryInst = new ethers.Contract(
  '0x78968635D38185418E0CADfbBfFc567aE85E69D0',
  WGFactory.abi, wallet
)
await factoryInst.deployed()
factoryInst.on('NewGame', handleGame)
