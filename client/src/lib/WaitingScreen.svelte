<script lang="ts">
  import { ethers } from 'ethers'
  import { onMount } from 'svelte'
  import { currentAddress, gameAddress } from './stores'
  import PlayersTab from './PlayersTab.svelte'
  import WordGame from '../../../truffle/build/contracts/WordGame.json'

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const gameInstance = new ethers.Contract($gameAddress, WordGame.abi, provider)
  const signedGameInstance = gameInstance.connect(provider.getSigner())

  let ownerAddress = ''
  let startingGame = false

  onMount(
    async () => (ownerAddress = (await gameInstance.getOwner()).toLowerCase())
  )

  function startGame() {
    startingGame = true
    signedGameInstance
      .startGame()
      .then(() => {})
      .catch(() => (startingGame = false))
  }

  function leaveGame() {}
</script>

<div class="flex h-screen">
  <div class="m-auto max-h-screen justify-center">
    <div
      class="grid grid-cols-1 gap-1 place-content-center h-10 justify-items-center"
    >
      <div>
        <button class="btn btn-active">
          GAME ADDRESS: {$gameAddress}
        </button>
      </div>
      <div>
        {#if startingGame}
          <button class="btn btn-primary m-2 h-20 text-xl w-60 loading">
            STARTING GAME
          </button>
        {:else}
          <button
            on:click={startGame}
            class="btn btn-primary m-2 h-20 text-xl w-60"
            disabled={gameInstance.started != $currentAddress}
          >
            START
          </button>
        {/if}
        <button
          on:click={leaveGame}
          class="btn btn-primary m-2 h-20 text-xl w-60"
        >
          LEAVE
        </button>
      </div>
    </div>
  </div>
  <PlayersTab />
</div>
