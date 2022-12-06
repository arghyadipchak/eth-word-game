{#if window.ethereum === undefined}
  <input type="checkbox" id="my-modal" class="modal-toggle" checked={true} />
  <div class="modal">
    <div class="modal-box flex flex-col items-center text-center">
      <h3 class="font-bold text-lg text-error">MetaMask Plugin Required!</h3>
      <p class="py-4">
        You have to install the MetaMask plugin to play the game
      </p>
      <div class="modal-action">
        <a
          href="https://metamask.io"
          target="_blank"
          rel="noreferrer"
          class="btn">Install MetaMask</a
        >
      </div>
    </div>
  </div>
{/if}
