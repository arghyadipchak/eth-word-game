<script lang="ts">
  import MetaMask from './lib/MetaMask.svelte'
  import StartJoin from './lib/StartJoin.svelte'
</script>

<main>
  <MetaMask />
  <!-- Fix no metamask install prompt -->
  <StartJoin />
</main>
