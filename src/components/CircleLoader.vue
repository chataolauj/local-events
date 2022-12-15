<template>
	<div class="loader" :style="{ width: width + 'px' }">
		<svg class="circular" viewBox="25 25 50 50">
			<circle
				class="path"
				cx="50"
				cy="50"
				r="20"
				fill="none"
				stroke-width="2"
				stroke-miterlimit="10"
			/>
		</svg>
	</div>
</template>

<script>
export default {
	name: "CircleLoader",
	props: {
		width: Number,
	},
};
</script>

<style lang="scss" scoped>
$width: 100px;
$primaryOne: #ff3b3f;
$primaryTwo: #51d0de;
$primaryThree: #e1e8f0;

.loader {
	position: relative;
	align-self: center;
	justify-self: center;
	margin: 0 auto;
	&:before {
		content: "";
		display: block;
		padding-top: 100%;
	}
}

.circular {
	animation: rotate 2s linear infinite;
	height: 100%;
	transform-origin: center center;
	width: 100%;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
}

.path {
	stroke-dasharray: 1, 200;
	stroke-dashoffset: 0;
	animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
	stroke-linecap: round;
}

@keyframes rotate {
	100% {
		transform: rotate(360deg);
	}
}

@keyframes dash {
	0% {
		stroke-dasharray: 1, 200;
		stroke-dashoffset: 0;
	}
	50% {
		stroke-dasharray: 89, 200;
		stroke-dashoffset: -35px;
	}
	100% {
		stroke-dasharray: 89, 200;
		stroke-dashoffset: -124px;
	}
}

@keyframes color {
	100%,
	0% {
		stroke: $primaryOne;
	}
	40% {
		stroke: $primaryOne;
	}
	66% {
		stroke: $primaryOne;
	}
	80%,
	90% {
		stroke: $primaryOne;
	}
}
</style>
