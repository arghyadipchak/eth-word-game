<script lang="ts">
  import { gameAddress, gameInst } from './stores'
  import StartJoin from './StartJoin.svelte'
  import GameScreen from './GameScreen.svelte'
  import WaitingScreen from './WaitingScreen.svelte'

  let gameStarted = false

  gameInst.subscribe(async gameI => {
    if ($gameAddress === '') gameStarted = false
    else {
      try {
        gameStarted = await gameI.gameStarted()
      } catch (_) {
        gameStarted = false
      }
      if (!gameStarted)
        gameI.on(
          'GameStarted',
          gameAdd => (gameStarted = $gameAddress == gameAdd)
        )
    }
  })
</script>

{#if $gameAddress === ''}
  <StartJoin />
{:else if !gameStarted}
  <WaitingScreen />
{:else}
  <GameScreen />
{/if}
