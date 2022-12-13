<script lang="ts">
  import { ethers } from 'ethers'
  import { gameAddress, judgeAddress, provider, factInst } from './stores'
  import WordGame from '../../../truffle/build/contracts/WordGame.json'

  let createButton = false
  let joinButton = false
  let joiningGame = false
  let joinAddress = ''
  let joinAlert = ''
  let tmpTx = { hash: '' }

  function toggleJoin() {
    joinButton = !joinButton
    joinAlert = ''
  }

  async function createGame() {
    createButton = true

    try {
      tmpTx = await $factInst.newGame($judgeAddress)
    } catch (_) {
      createButton = false
    }
  }

  $factInst.on('NewGame', (game, event) => {
    if (event.transactionHash == tmpTx.hash) gameAddress.update(() => game)
  })

  async function joinGame() {
    if (joinAddress === '') {
      joinAlert = ''
      return
    }

    try {
      if (!(await $factInst.checkGame(joinAddress))) throw ''
      joinAlert = ''
    } catch (_) {
      joinAlert = 'Invalid Game Address!'
      return
    }

    joiningGame = true
    let tmpTx = { hash: '' }

    try {
      let tmpInst = new ethers.Contract(
        joinAddress,
        WordGame.abi,
        $provider.getSigner()
      )
      tmpTx = await tmpInst.joinGame()

      tmpInst.on('PlayerJoined', (player, event) => {
        if (event.transactionHash == tmpTx.hash) {
          gameAddress.update(() => joinAddress)
        }
      })
      tmpInst.on('PlayerRejected', async (player, event) => {
        if (event.transactionHash == tmpTx.hash) {
          joinAlert = (await tmpInst.gameStarted())
            ? 'Game Already Started!'
            : 'Unable to Join Game!'
          joiningGame = false
        }
      })
    } catch (err) {
      joinAlert = 'Unable to Join Game!'
      joiningGame = false
    }
  }
</script>

<div class="flex h-screen">
  <div class="m-auto">
    <div
      class="grid grid-cols-1 gap-1 place-content-center h-10 justify-items-center"
    >
      {#if joinButton}
        <div class="form-control">
          <input
            type="text"
            bind:value={joinAddress}
            placeholder="Enter Game Address"
            class="input input-bordered input-primary input-lg max-w-prose w-[32rem] text-xl"
          />
          <label class="label" for="">
            <span class="label-text-alt text-error">{joinAlert}</span>
          </label>
        </div>
        <div>
          {#if joiningGame}
            <button class="btn btn-primary m-2 h-20 text-xl w-60 loading">
              JOINING GAME
            </button>
          {:else}
            <button
              on:click={joinGame}
              class="btn btn-primary m-2 h-20 text-xl w-60"
            >
              JOIN
            </button>{/if}
          <button
            on:click={toggleJoin}
            class="btn btn-ghost btn-primary m-2 h-15 text-lg"
            disabled={joiningGame}
          >
            BACK
          </button>
        </div>
      {:else if createButton}
        <div>
          <button class="btn btn-primary m-2 h-20 text-xl w-60 loading">
            CREATING GAME
          </button>
        </div>
      {:else}
        <div>
          <button
            on:click={createGame}
            class="btn btn-primary m-2 h-20 text-xl w-60"
          >
            CREATE A GAME
          </button>
        </div>
        <div>
          <button
            on:click={toggleJoin}
            class="btn btn-primary m-2 h-20 text-xl  w-60"
          >
            JOIN A GAME
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
