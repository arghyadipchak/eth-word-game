<script lang="ts">
  import { currentAddress, gameAddress, gameInst, provider } from './stores'
  import PlayersTab from './PlayersTab.svelte'
  import WordsTab from './WordsTab.svelte'

  let lives = 0
  let myIndex = 0
  let turn = 0
  let word = ''
  let wordAlert = ''
  let waitingApp = false
  let sendingWord = false
  let leavingGame = false

  gameInst.subscribe(async gameI => {
    try {
      lives = await gameI.getLives()
      myIndex = await gameI.getPlayerIndex($currentAddress)
      turn = await gameI.getTurn()

      if (turn == myIndex) [word, waitingApp] = await gameI.getApproval()
    } catch (_) {
      lives = 0
      myIndex = -1
      turn = 0
      word = ''
      waitingApp = false
    }

    wordAlert = ''
    sendingWord = false
    leavingGame = false
  })

  async function sendWord() {
    if (word === '') return

    sendingWord = true
    try {
      if (
        $gameInst.connect($provider.getSigner()).sendWord(word.toLowerCase())
      ) {
        waitingApp = true
        $gameInst.on('Turn', () => {})
      }
    } catch (_) {}
    sendingWord = false
  }

  async function leaveGame() {
    leavingGame = true
    try {
      if (await $gameInst.connect($provider).leaveGame()) {
        gameAddress.update(() => '')
        return
      }
    } catch (_) {}
    leavingGame = false
  }
</script>

<div class="flex h-screen">
  <WordsTab />
  <div class="m-auto max-h-screen justify-center">
    <div
      class="grid grid-cols-1 gap-1 place-content-center h-10 justify-items-center"
    >
      <div class="mb-5">
        <button class="btn btn-active">
          GAME ADDRESS: {$gameAddress}
        </button>
      </div>
      <div>
        <button class="btn btn-outline btn-accent m-2 h-20 text-xl w-60">
          LIVES LEFT: {lives}
        </button>
      </div>
      <div class="form-control mt-2">
        <input
          type="text"
          bind:value={word}
          placeholder="Enter Word"
          class="input input-bordered input-primary input-lg max-w-prose w-[32rem] text-xl"
        />
        <label class="label" for="">
          <span class="label-text-alt text-error">{wordAlert}</span>
        </label>
      </div>
      <div>
        {#if waitingApp}
          <button class="btn btn-primary m-2 h-20 text-xl w-60 loading">
            WAITING APPROVAL
          </button>
        {:else if sendingWord}
          <button class="btn btn-primary m-2 h-20 text-xl w-60 loading">
            SENDING WORD
          </button>
        {:else}
          <button
            on:click={sendWord}
            class="btn btn-primary m-2 h-20 text-xl w-60"
            disabled={leavingGame}
          >
            SEND
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
            disabled={sendingWord || waitingApp}
          >
            LEAVE
          </button>
        {/if}
      </div>
    </div>
  </div>
  <PlayersTab />
</div>
