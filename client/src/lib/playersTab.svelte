<script>
  import { gameAddress, plays } from './stores'
  import { ethers } from 'ethers'
  import WordGame from '../../../truffle/build/contracts/WordGame.json'

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  let gameInstance = new ethers.Contract($gameAddress, WordGame.abi, provider)

  let numPlayers
  let playerL

  async function getPlayers() {
    if ($gameAddress !== '') {
      gameInstance = new ethers.Contract($gameAddress, WordGame.abi, provider)
      numPlayers = await gameInstance.playerCount()
      let array = []
      for (let i = 0; i < numPlayers; i += 1) {
        let x = await gameInstance.playerList(i)
        array.push(x) // where getItem do items[I] in solidity
      }
      return array
    }
  }

  gameInstance.on('NewPlayer', player => {
    getPlayers().then(x => plays.update(_ => x))
  })

  plays.subscribe(x => {
    playerL = x
  })
</script>

<div class="flex h-screen">
  <div class="m-auto">
    <button on:click={getPlayers}>{playerL}</button>
  </div>
</div>
