<script lang="ts">
  import { currentAddress, gameAddress, gameInst, provider } from './stores'
  import { truncate } from './utils'
  import PlayersTab from './PlayersTab.svelte'
  import WordsTab from './WordsTab.svelte'

  let myIndex = -1
  let lives = 0
  let turn = 0
  let inputWord = ''
  let wordAlert = ''
  let waitingApp = false
  let sendingWord = false
  let passingTurn = false
  let leavingGame = false
  let addressCopied = false
  let tmpTx = { hash: '' }

  gameInst.subscribe(async gameI => {
    wordAlert = ''
    sendingWord = false
    passingTurn = false
    leavingGame = false
    addressCopied = false
    tmpTx = { hash: '' }

    try {
      myIndex = (await gameI.getIndex()).toNumber()
      lives = (await gameI.getLives()).toNumber()
      turn = (await gameI.getTurn()).toNumber()

      if (turn == myIndex) {
        let tmp = await $gameInst.getApproval()
        waitingApp = tmp[0]
        inputWord = waitingApp ? tmp[1] : ''
      } else {
        waitingApp = false
        inputWord = ''
      }
    } catch (_) {
      myIndex = -1
      lives = 0
      turn = 0
      waitingApp = false
      inputWord = ''
    }

    gameI.on('Approval', (word, event) => {
      if (
        event.transactionHash == tmpTx.hash &&
        sendingWord &&
        inputWord == word
      ) {
        waitingApp = true
        sendingWord = false
        tmpTx = { hash: '' }
      }
    })
    gameI.on('Turn', (player, playerLives, nextTurn, word, correct, event) => {
      if (
        event.transactionHash == tmpTx.hash ||
        (player.toLowerCase() == $currentAddress && inputWord == word)
      ) {
        lives = playerLives
        inputWord = ''
        wordAlert = correct
          ? 'Good Turn'
          : word == ''
          ? 'Passed Turn'
          : 'Bad Turn'
        waitingApp = false
        sendingWord = false
        passingTurn = false
        tmpTx = { hash: '' }
      }
      turn = nextTurn
    })
    gameI.on('PlayerLeft', (_, event) => {
      if (event.transactionHash == tmpTx.hash) gameAddress.update(() => '')
      else
        gameI
          .getTurn()
          .then(v => (turn = v))
          .catch(() => {})
    })
  })

  async function sendWord() {
    if (
      inputWord === '' ||
      lives == 0 ||
      myIndex != turn ||
      waitingApp ||
      passingTurn ||
      leavingGame
    )
      return

    sendingWord = true
    try {
      tmpTx = await $gameInst.sendWord(inputWord.toLowerCase())
    } catch (_) {
      sendingWord = false
    }
  }

  async function passTurn() {
    if (
      lives == 0 ||
      myIndex != turn ||
      sendingWord ||
      waitingApp ||
      leavingGame
    )
      return

    passingTurn = true
    try {
      tmpTx = await $gameInst.passTurn()
    } catch (_) {
      passingTurn = false
    }
  }

  async function leaveGame() {
    if (sendingWord || waitingApp || passingTurn) return

    leavingGame = true
    try {
      tmpTx = await $gameInst.leaveGame()
    } catch (_) {
      leavingGame = false
    }
  }

  function clickCopy() {
    navigator.clipboard.writeText($gameAddress)
    addressCopied = false
  }
</script>

<div class="flex h-screen">
  <WordsTab />
  <div class="m-auto max-h-screen justify-center">
    <div
      class="grid grid-cols-1 gap-1 place-content-center h-10 justify-items-center"
    >
      <div class="mb-2">
        <button class="btn case normal-case" on:click={clickCopy}>
          GAME ADDRESS : &nbsp;<span class="tracking-wider"
            >{truncate($gameAddress, 6, 4)}</span
          >
        </button>
      </div>
      <div class="btn btn-outline btn-accent text-accent mb-4">
        LIVES LEFT : {lives}
      </div>
      <div class="form-control mt-2">
        <input
          type="text"
          bind:value={inputWord}
          placeholder="Enter Word"
          class="input input-bordered input-primary input-lg max-w-prose w-[32rem] text-xl"
          disabled={myIndex != turn}
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
            disabled={inputWord === '' ||
              lives == 0 ||
              myIndex != turn ||
              waitingApp ||
              passingTurn ||
              leavingGame}
          >
            SEND
          </button>
        {/if}
        {#if passingTurn}
          <button class="btn btn-primary m-2 h-20 text-xl w-60 loading">
            PASSING TURN
          </button>
        {:else if leavingGame}
          <button class="btn btn-error m-2 h-20 text-xl w-60 loading">
            LEAVING GAME
          </button>
        {:else}
          <button
            on:click={passTurn}
            class="btn btn-primary m-2 h-20 text-xl w-30 rounded-l-lg"
            disabled={lives == 0 ||
              myIndex != turn ||
              sendingWord ||
              waitingApp ||
              leavingGame}
          >
            PASS
          </button>
          <button
            on:click={leaveGame}
            class="btn btn-error m-2 h-20 text-xl w-30 rounded-r-lg"
            disabled={sendingWord || waitingApp || passingTurn}
          >
            LEAVE
          </button>
        {/if}
      </div>
    </div>
  </div>
  <PlayersTab />
</div>
