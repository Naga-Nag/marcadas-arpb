<script>
	import QRCode from '@castlenine/svelte-qrcode';
</script>

<body class="box">
	<div class="d:flex flex:col justify-content:center align-items:center h:100% w:100%">
		<div class="z:1 outline:4|solid|black">
			<QRCode data="https://github.com/Naga-Nag" />
		</div>
		<img src="/github.svg" alt="" class="width:40 height:40 mt:20 z:0" />
	</div>

	<div><b class="font-size:50 z:0">👻</b></div>
</body>

<style>
	body {
		background: linear-gradient(-45deg, #c56244, #e73c7e, #2eb7e9, #20ba96);
		background-size: 800% 800%;
		animation: gradient 20s ease infinite;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.box {
		background-color: #006699;
		margin: 0 auto;
		width: 1500px;
		height: 900px;
		position: relative;
		box-shadow: inset 0 0 20px #155;
		border-radius: 20px;
		border: 1px solid #111;
		overflow: hidden;
	}

	.box b {
		display: block;
		width: 0px;
		height: 0px;
		border-radius: 50%;
		background-color: #999999;
		box-shadow:
			inset -5px -5px 5px rgba(0, 0, 0, 0.6),
			15px 15px 2px rgba(0, 0, 0, 0.04);
		position: absolute;
		-webkit-animation:
			moveX 4s linear 0s infinite alternate,
			moveY 6.8s linear 0s infinite alternate;
		-moz-animation:
			moveX 4s linear 0s infinite alternate,
			moveY 6.8s linear 0s infinite alternate;
		-o-animation:
			moveX 4s linear 0s infinite alternate,
			moveY 6.8s linear 0s infinite alternate;
		animation:
			moveX 4s linear 0s infinite alternate,
			moveY 6.8s linear 0s infinite alternate;
	}

	@-webkit-keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: 1440px;
		}
	}
	@-moz-keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: 1440px;
		}
	}
	@-o-keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: 1440px;
		}
	}
	@keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: 1440px;
		}
	}

	@-webkit-keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: 840px;
		}
	}
	@-moz-keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: 840px;
		}
	}
	@-o-keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: 840px;
		}
	}
	@keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: 840px;
		}
	}
</style>
