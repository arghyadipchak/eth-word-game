<script lang="ts">
  import MetaMask from './lib/MetaMask.svelte'
  import Navbar from './lib/Navbar.svelte'
  import StartJoin from './lib/StartJoin.svelte'
</script>

<main>
  <Navbar />
  <MetaMask />
  <!-- Fix no metamask install prompt -->
  <StartJoin />
</main>
