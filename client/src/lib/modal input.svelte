<script>
  let name = ''

  function logname() {
    console.log(name)
  }
</script>

<!-- The button to open modal -->
<label for="my-modal" class="btn">open modal</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Set a name for yourself</h3>
    <input bind:value={name} type="input" placeholder="Enetr name here" />
    <div class="modal-action">
      <label for="my-modal" class="btn">Set name</label>
    </div>
  </div>
</div>

<button on:click={logname} class="btn"> yes </button>

<a href="/waitscreen/" class="btn">game screen</a>
