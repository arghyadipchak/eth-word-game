import { ethers } from 'ethers'
import worddict from './worddict.json' assert { type: 'json' }
import WGFactory from '../../truffle/build/contracts/WordGameFactory.json' assert { type: 'json' }
import WordGame from '../../truffle/build/contracts/WordGame.json' assert { type: 'json' }

const factAddress = '0x79Abe9b660e2a2302c06eF1C13b135C02b7d6Ae8'
const wallPrvtKey =
  '80264b77b3b4144c203777140656bc274f045d83019e69d1beb478cb2bf8e8a4'

function binarySearch(arr, x) {
  let l = 0
  let r = arr.length - 1
  let m, res

  while (l <= r) {
    m = l + Math.floor((r - l) / 2)
    res = x.localeCompare(arr[m])

    if (res == 0) return true
    if (res > 0) l = m + 1
    else r = m - 1
  }
  return false
}

function insertSorted(arr, x) {
  arr.push('')
  let i = arr.length - 2
  while (i >= 0 && arr[i].localeCompare(x) > 0) arr[i + 1] = arr[i--]
  arr[i + 1] = x
}

async function handleGame(game) {
  const gameInst = new ethers.Contract(game, WordGame.abi, wallet)
  let usedWords = [await gameInst.getLastWord()]

  gameInst.on('Approval', async word => {
    word = word.toLowerCase()
    if (!binarySearch(usedWords, word) && binarySearch(worddict, word)) {
      await gameInst.setApproval(true)
      insertSorted(usedWords, word)
    } else await gameInst.setApproval(false)
  })
}

let provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545')
await provider.ready

const factoryInst = new ethers.Contract(factAddress, WGFactory.abi, provider)
await factoryInst.deployed()

const wallet = new ethers.Wallet(wallPrvtKey, provider)
factoryInst.on('NewGame', handleGame)
