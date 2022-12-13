<script lang="ts">
  import { currentAddress, gameAddress, gameInst, provider } from './stores'
  import PlayersTab from './PlayersTab.svelte'

  let ownerAddress = ''
  let startingGame = false
  let leavingGame = false
  let addressCopied = false
  let tmpTx = { hash: '' }

  gameInst.subscribe(async gameI => {
    startingGame = false
    leavingGame = false
    addressCopied = false
    tmpTx = { hash: '' }

    try {
      ownerAddress = (await gameI.getOwner()).toLowerCase()
    } catch (_) {
      ownerAddress = ''
    }

    gameI.on('PlayerLeft', (player, event) => {
      if (event.transactionHash == tmpTx.hash) {
        gameAddress.update(() => '')
      }
    })
  })

  async function startGame() {
    if (ownerAddress != $currentAddress || leavingGame) return

    startingGame = true
    try {
      await $gameInst.startGame()
    } catch (_) {
      startingGame = false
    }
  }

  async function leaveGame() {
    if (startingGame) return

    leavingGame = true
    try {
      tmpTx = await $gameInst.leaveGame()
    } catch (_) {
      leavingGame = false
    }
  }

  function clickCopy() {
    navigator.clipboard.writeText($gameAddress)
    addressCopied = true
  }
</script>

<div class="flex h-screen">
  <div class="m-auto max-h-screen justify-center">
    <div
      class="grid grid-cols-1 gap-1 place-content-center h-10 justify-items-center"
    >
      <div>
        {#if addressCopied}
          <label class="label" for="">
            <span class="label-text-alt text-success" />
            <span class="label-text-alt text-success">Game Address copied!</span
            >
          </label>
        {/if}
        <button class="btn case normal-case text-lg" on:click={clickCopy}>
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
