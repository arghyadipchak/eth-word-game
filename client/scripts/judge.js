import { ethers } from 'ethers'
import WordGame from '../../truffle/build/contracts/WordGame.json' assert { type: 'json' }

let provider = new ethers.providers.JsonRpcProvider('http://localhost:7545')
let wallet = new ethers.Wallet(
  '0f7cfd9245df1841aebc443ca8830b8898a6ba6d41228ea51fe1f20184a7e8c6',
  provider
)

const gameInstance = new ethers.Contract('', WordGame.abi, provider)

gameInstance.on('NewPlayer', player => console.log(player))
