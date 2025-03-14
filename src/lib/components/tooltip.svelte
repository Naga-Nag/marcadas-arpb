<script>
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
    visibility: hidden;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: 125%; /* Position above the element */
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .tooltip-container:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
</style>

<div class="tooltip-container" role="tooltip" on:mouseover={showTooltip} on:mouseleave={hideTooltip} on:focus={showTooltip} on:blur={hideTooltip}>
  <slot></slot>
  {#if visible}
    <div class="tooltip">{text}</div>
  {/if}
</div>

