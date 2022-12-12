<script lang="ts">
  import { currentAddress, gameAddress, gameInst, provider } from './stores'
  import PlayersTab from './PlayersTab.svelte'

  let ownerAddress = ''
  let startingGame = false
  let leavingGame = false
  let addressCopied = ''

  gameInst.subscribe(async gameI => {
    ownerAddress = (await gameI.getOwner()).toLowerCase()
    startingGame = false
    leavingGame = false
    addressCopied = ''
  })

  async function startGame() {
    startingGame = true
    try {
      await $gameInst.connect($provider.getSigner()).startGame()
    } catch (_) {
      startingGame = false
    }
  }

  async function leaveGame() {
    leavingGame = true
    try {
      if (await $gameInst.connect($provider.getSigner()).leaveGame()) {
        gameAddress.update(() => '')
        return
      }
    } catch (_) {}
    leavingGame = false
  }

  function clickcopy() {
    navigator.clipboard.writeText($gameAddress)
    addressCopied = 'Game Address copied!'
  }
</script>

<div class="flex h-screen">
  <div class="m-auto max-h-screen justify-center">
    <div
      class="grid grid-cols-1 gap-1 place-content-center h-10 justify-items-center"
    >
      <div>
        <label class="label" for="">
          <span class="label-text-alt text-success" />
          <span class="label-text-alt text-success">{addressCopied}</span>
        </label>
        <button class="btn case normal-case text-lg" on:click={clickcopy}>
          GAME ADDRESS : &nbsp;<span class="tracking-wider">{$gameAddress}</span
          >
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
            disabled={ownerAddress != $currentAddress || leavingGame}
          >
            START
          </button>
        {/if}
        {#if leavingGame}
          <button class="btn btn-primary m-2 h-20 text-xl w-60 loading">
            LEAVING GAME
          </button>
        {:else}
          <button
            on:click={leaveGame}
            class="btn btn-primary m-2 h-20 text-xl w-60"
            disabled={startingGame}
          >
            LEAVE
          </button>
        {/if}
      </div>
    </div>
  </div>
  <PlayersTab />
</div>
