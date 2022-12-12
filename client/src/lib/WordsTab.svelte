<script lang="ts">
  import { gameInst } from './stores'

  let words = []

  gameInst.subscribe(async gameI => {
    try {
      words = [await gameI.getLastWord()]
    } catch (_) {
      words = []
    }
    gameI.on('Turn', (player, turn, word, correct) => {
      if (correct) words.push(word)
    })
  })
</script>

<div class="m-auto h-2/3 overflow-x-hidden overflow-y-auto">
  <div class="flex flex-col gap-1">
    {#each words as word}
      <div class="btn btn-primary">{word}</div>
    {/each}
  </div>
</div>
