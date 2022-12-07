<script>
  let currentAddress =
    window.ethereum === undefined ? '' : window.ethereum.selectedAddress

  window.ethereum.on('accountsChanged', function () {
    currentAddress = window.ethereum.selectedAddress
  })
</script>

{#if window.ethereum === undefined || !window.ethereum.isMetaMask}
  <input
    type="checkbox"
    id="MetaMaskConnect"
    class="modal-toggle"
    checked={true}
  />
  <div class="modal backdrop-blur-sm">
    <div class="modal-box flex flex-col items-center text-center">
      <h2 class="font-bold text-lg text-error">MetaMask Plugin Required!</h2>
      <p class="py-4 text-currentColor">
        You have to install the MetaMask plugin to play the game
      </p>
      <div class="modal-action">
        <a
          href="https://metamask.io"
          target="_blank"
          rel="noreferrer"
          class="btn bth-primary">Install MetaMask</a
        >
      </div>
    </div>
  </div>
{:else if !currentAddress}
  <input
    type="checkbox"
    id="WalletConnect"
    class="modal-toggle"
    checked={true}
  />
  <div class="modal backdrop-blur-sm">
    <div class="modal-box flex flex-col items-center text-center">
      <h1 class="font-bold text-lg text-error">
        Please connect your MetaMask account
      </h1>
      <div class="modal-action">
        <div class="grid gap-2">
          <div class="flex items-center justify-center space-x-2 animate-pulse">
            <div class="w-4 h-4 bg-primary rounded-full" />
            <div class="w-4 h-4 bg-primary rounded-full" />
            <div class="w-4 h-4 bg-primary rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<div class="navbar bg-base-100">
  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl text-primary" href="/"
      >BlockChain Antakshari</a
    >
  </div>

  <label class="swap justify-items-end">
    <input type="checkbox" />
    <p class="swap-on btn m-1">
      CURRENT: &nbsp <span class="normal-case">{currentAddress}</span>
    </p>
    <p class="swap-off fill-current btn m-1">ACCOUNT</p>
  </label>
</div>
