<script>
  import { fade } from 'svelte/transition';

  export let text = 'Tooltip text'; // The text to display inside the tooltip
  let visible = false;

  function showTooltip() {
    visible = true;
  }

  function hideTooltip() {
    visible = false;
  }
</script>

<style>
  .tooltip-container {
    position: relative;
    display: inline-block;
  }

  .tooltip {
    background-color: rgba(0, 0, 0, 0.61);
    color: #fff;
    text-align: center;
    border-radius: 5px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    top: 50%; /* Position vertically centered */
    left: 125%; /* Position to the right of the element */
    transform: translateY(-50%);

    white-space: nowrap; /* Prevent text from wrapping */
  }
</style>

<div class="tooltip-container" role="tooltip" on:mouseover={showTooltip} on:mouseleave={hideTooltip} on:focus={showTooltip} on:blur={hideTooltip}>
  <slot></slot>
  {#if visible}
    <div class="tooltip" transition:fade>{text}</div>
  {/if}
</div>
