<script lang="ts">
	export let editable = false; // Whether the cell is editable
	export let row; // Row object of the cell
	export let column; // Column object of the cell
	export let value: string; // Current value of the cell
	export let onUpdateValue /* : (rowUID: string | number, columnId: string, newValue: string) => void */;

	let isEditing = false;
	let inputElement: HTMLInputElement;

	$: if (isEditing) inputElement?.focus();

	const handleCancel = () => {
		isEditing = false;
	};

	const handleSubmit = () => {
		isEditing = false;
		if (row.isData()) {
			onUpdateValue(row.dataId, column.id, value);
		}
	};
</script>

<div>
	{#if editable}
		{#if !isEditing}
			<!-- svelte-ignore a11y-interactive-supports-focus -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<span role="button" on:click={() => (isEditing = true)}>
				{value || 'No definido'}
			</span>
		{:else}
			<form on:submit|preventDefault={handleSubmit}>
				<input bind:this={inputElement} type="text" bind:value />
				<button type="submit">✔️</button>
				<button type="button" on:click={handleCancel}>❌</button>
			</form>
		{/if}
	{:else}
		{value}
	{/if}
</div>

<style>
	div {
		display: inline-block;
	}

	form {
		display: flex;
		gap: 0.5rem;
	}

	input {
		border: 1px solid #000000;
		padding: 4px;
		font-size: 1rem;
	}

	button {
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 1rem;
	}
</style>
