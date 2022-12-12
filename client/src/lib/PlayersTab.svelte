<script lang="ts">
  import { ethers } from 'ethers'
  import { onMount } from 'svelte'
  import { gameAddress } from './stores'
  import WordGame from '../../../truffle/build/contracts/WordGame.json'
  import { truncate } from './utils'

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const gameInstance = new ethers.Contract($gameAddress, WordGame.abi, provider)

  let players = []
  let alive = {}

  onMount(async () => {
    let tmp
    let tmpPlayers = []
    let tmpAlive = {}
    for (let i = 0; i < (await gameInstance.playerCount()); i++) {
      tmp = await gameInstance.playerList(i)
      tmpPlayers.push(tmp[0])
      tmpAlive[tmp[0]] = tmp[1]
    }
    players = tmpPlayers
    alive = tmpAlive
  })

  gameInstance.on('NewPlayer', player => {
    if (!(player in players)) players.push(player)
    alive[player] = true
  })
  gameInstance.on('PlayerDead', player => {
    alive[player] = false
  })
</script>

<div class="m-auto h-2/3 overflow-x-hidden overflow-y-auto border-2 rounded-xl">
  <div class="flex flex-col gap-1 items-center">
    <span class="text-lg m-2 font-semibold">Players</span>
    {#each players as player}
      {#if alive[player]}
        <div class="player bg-primary text-primary-content">
          {player}
        </div>
      {:else}
        <div class="btn btn-secondary normal-case ">
          {player}
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .player {
    display: inline-block;
    padding: 1em;
    text-align: center;
    letter-spacing: 0.025em;
    text-align: center;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    border-width: 4px;
    border: hsl(var(--b1));
  }
</style>
