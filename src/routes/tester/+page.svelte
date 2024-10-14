<script>
	import Tag from '$lib/components/Tag.svelte';
</script>

<body>
	<div class="p:10 cursor:default">
		<Tag label="Entrada" color="green" />
		<Tag label="Salida" color="red" />
		<Tag label="Entradas Intermedias" color="blue" />
	</div>
</body>

<style>
    body {
        display: flex;
        margin: 0;
        height: 98vh;
        width: 99vw;
        background: linear-gradient(-180deg, #306cce, #2eb7e9);
        background-size: 200% 200%;
    }
</style>
