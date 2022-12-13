<script lang="ts">
  import { currentAddress, gameAddress, gameInst } from './stores'
  import CreateJoin from './CreateJoin.svelte'
  import GameScreen from './GameScreen.svelte'
  import WaitingScreen from './WaitingScreen.svelte'
  import { ethers } from 'ethers'

  currentAddress.subscribe(() => gameAddress.update(() => ''))

  let gameStarted = false
  let winner = ''

  gameInst.subscribe(async gameI => {
    if ($gameAddress === '') {
      gameStarted = false
      winner = ''
    } else {
      try {
        gameStarted = await gameI.gameStarted()
        winner = await gameI.getWinner()
        if (winner == ethers.constants.AddressZero) winner = ''
      } catch (_) {
        gameStarted = false
        winner = ''
      }

      if (!gameStarted)
        gameI.on(
          'GameStarted',
          gameAdd => (gameStarted = $gameAddress == gameAdd)
        )
      if (winner === '') gameI.on('PlayerWon', player => (winner = player))
    }
  })
</script>

{#if $gameAddress === ''}
  <CreateJoin />
{:else if winner !== ''}
  <div class="flex h-screen">
    <div class="m-auto max-h-screen justify-center">
      <div
        class="grid grid-cols-1 gap-5 place-content-center h-10 justify-items-center"
      >
        <div>
          <button class="btn normal-case text-lg">
            GAME ADDRESS : &nbsp;<span class="tracking-wider"
              >{$gameAddress}</span
            >
          </button>
        </div>
        <div class="btn btn-outline btn-accent text-accent">
          {#if winner.toLowerCase() == $currentAddress}
            YOU WON!
          {:else}
            WINNER : &nbsp;<span class="tracking-wider">{$currentAddress}</span>
          {/if}
        </div>
      </div>
    </div>
  </div>
{:else if !gameStarted}
  <WaitingScreen />
{:else}
  <GameScreen />
{/if}
