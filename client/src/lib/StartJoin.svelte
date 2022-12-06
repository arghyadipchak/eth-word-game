<script>
  let validGame = true
  let gameActive = false
  let gameStarted = false

  let joinButton = false
  let startButton = false

  let joinAddress = ''
  let startAddress = '0xD2E4F96673DE0116FF2fFf80a42e222CD7Ec15B4'

  function toggleStart() {
    startButton = startButton !== true
  }

  function StartGame() {
    //returns a start address
  }

  function toggleJoin() {
    joinButton = joinButton !== true
  }

  function joinGame() {
    // This is a function which first checks if the address is valid
    // Then goes to the next screen
  }
</script>

<!-- <div class="grid grid-cols-1 gap-1 place-content-center h-30 ...">
  <div>
    <button on:click={StartGame} class="btn bth-lg btn-primary m-1">
      Start a game {count}
      {count === 1 ? 'time' : 'times'}
    </button>
  </div>
  <div>
    <button on:click={toggleJoin} class="btn bth-lg btn-primary m-1">
      Join a game {count}
      {count === 1 ? 'time' : 'times'}
    </button>
  </div>
</div> -->

<div class="flex h-screen">
  <div class="m-auto">
    <div
      class="grid grid-cols-1 gap-1 place-content-center h-10 justify-items-center ..."
    >
      <div>
        {#if !joinButton && !startButton}
          <button
            on:click={toggleStart}
            class="btn bth-lg btn-primary m-2 h-20 text-xl  w-60"
          >
            Start a game
          </button>
        {:else if joinButton && !startButton}
          <input
            type="text"
            value={joinAddress}
            placeholder="Enter game address"
            class="input input-lg input-ghost max-w-prose w-[32rem] text-xl"
          />
        {:else}
          <p class="text-primary text-xl">
            Game Address : <br />
            {startAddress}
          </p>
          <!-- Show address of the game contract-->
        {/if}
      </div>
      <div>
        {#if !joinButton && !startButton}
          <button
            on:click={toggleJoin}
            class="btn bth-lg btn-primary m-2 h-20 text-xl  w-60"
          >
            Join a game
          </button>
        {:else if joinButton && !startButton}
          <button
            on:click={joinGame}
            class="btn bth-lg btn-primary m-2 h-20 text-xl w-60"
          >
            JOIN
          </button>
          <button
            on:click={toggleJoin}
            class="btn btn-ghost btn-primary m-2 h-15 text-lg"
          >
            back
          </button>
        {:else}
          <button
            on:click={StartGame}
            class="btn bth-lg btn-primary m-2 h-20 text-xl w-60"
          >
            START
          </button>
          <button
            on:click={toggleStart}
            class="btn btn-ghost btn-primary m-2 h-15 text-lg"
          >
            back
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>
