<script>
  import { gameAddress } from './stores'
  import { ethers } from 'ethers'
  import WordGame from '../../../truffle/build/contracts/WordGame.json'

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const gameInstance = new ethers.Contract($gameAddress, WordGame.abi, provider)

  let numPlayers
  let playerList

  async function getPlayers() {
    numPlayers = await gameInstance.playerCount()
    let array = []
    for (let i = 0; i < numPlayers; i += 1) {
      let x = await gameInstance.playerList(i)
      array.push(x) // where getItem do items[I] in solidity
    }
    playerList = array
    console.log(playerList.length)
  }

  gameInstance.on('NewPlayer', player => {
    console.log(player)
    playerList.push(player)
  })
</script>

<div class="flex h-screen">
  <div class="m-auto">
    <button on:click={getPlayers}>{playerList}</button>
  </div>
</div>
