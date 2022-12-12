<script lang="ts">
  import { ethers } from 'ethers'
  import { onMount } from 'svelte'
  import { gameAddress } from './stores'
  import WordGame from '../../../truffle/build/contracts/WordGame.json'

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const gameInstance = new ethers.Contract($gameAddress, WordGame.abi, provider)

  let players = []

  onMount(async () => {
    let tmp
    let arr = []
    for (let i = 0; i < (await gameInstance.playerCount()); i++) {
      tmp = await gameInstance.playerList(i)
      arr.push({ address: tmp[0], alive: tmp[1] })
    }
    players = arr
  })

  gameInstance.on('NewPlayer', playerAdd =>
    players.push({ address: playerAdd, alive: true })
  )
  gameInstance.on('PlayerDead', playerAdd => {
    for (let i = 0; i < players.length; i++)
      if (players[i].address == playerAdd) {
        players[i].alive = false
        break
      }
  })
</script>

<div class="m-auto h-2/3 overflow-x-hidden overflow-y-auto">
  <div class="flex flex-col gap-1">
    {#each players as player}
      {#if player.alive}
        <div class="btn btn-primary">{player.address}</div>
      {:else}
        <div class="btn btn-secondary">{player.address}</div>
      {/if}
    {/each}
  </div>
</div>
