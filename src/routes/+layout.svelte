<script lang="ts">
	import '$lib/master.css';
</script>

<head>
	<title>Presentismo</title>
</head>
<body>
	<slot></slot>
</body>

<style>
	@font-face {
		font-family: 'Comfortaa';
		font-style: normal;
		font-weight: 500;
		src: url('/Comfortaa.ttf');
	}

	html::-webkit-scrollbar {
		display: none;
	}

	body {
		background: linear-gradient(-180deg, #306cce, #2eb7e9);
		background-size: 400% 400%;
		margin: 0 auto;
		overflow: hidden;
	}
</style>
