<script lang="ts">
  import { gameInst } from './stores'

  let words = []

  gameInst.subscribe(async gameI => {
    try {
      words = [await gameI.getLastWord()]
    } catch (_) {
      words = []
    }
    gameI.on('Turn', (player, playerLives, nextTurn, word, correct) => {
      if (correct) words = [word].concat(words.slice(0, 5))
    })
  })
</script>

<div class="m-auto h-2/3 overflow-x-hidden overflow-y-auto border-2 rounded-xl">
  <div class="flex flex-col gap-1 items-center">
    <span class="text-lg m-2 font-semibold">Words</span>
    {#each words as word}
      <div
        class="bg-primary text-primary-content w-full p-2 font-semibold font-mono"
      >
        {word}
      </div>
    {/each}
  </div>
</div>
