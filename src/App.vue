<template>
	<div id="app">
		<Search id="search-bar" />
		<div id="content">
			<div id="hover-panel">
				<transition name="slide-out">
					<EventList v-show="showPanel" />
				</transition>
				<div v-if="loadingMore" class="load-more-overlay">
					<CircleLoader :width="100" />
				</div>
				<button
					@click="showPanel = !showPanel"
					:disabled="loadingMore"
					:class="[
						'toggle-button',
						'fas',
						showPanel && !isWindowSmall
							? 'fa-caret-left'
							: !showPanel && !isWindowSmall
							? 'fa-caret-right'
							: showPanel && isWindowSmall
							? 'fa-caret-down'
							: 'fa-caret-up',
					]"
					aria-label="Collapse side panel"
				></button>
			</div>
			<Mapbox />
		</div>
	</div>
</template>

<script>
import Search from "./components/Search.vue";
import EventList from "./components/EventList.vue";
import Mapbox from "./components/Mapbox.vue";
import CircleLoader from "./components/CircleLoader.vue";

export default {
	name: "app",
	components: {
		Search,
		EventList,
		CircleLoader,
		Mapbox,
	},
	data() {
		return {
			isWindowSmall: null,
			showPanel: true,
		};
	},
	mounted() {
		this.$nextTick(() => {
			window.addEventListener("resize", this.onResize);
			this.onResize();
		});
	},
	computed: {
		loading() {
			return this.$store.state.loading;
		},
		loadingMore() {
			return this.$store.state.loadingMore;
		},
	},
	methods: {
		onResize() {
			if (window.innerWidth <= 640) {
				this.isWindowSmall = true;
			} else {
				this.isWindowSmall = false;
			}
		},
	},
	watch: {
		loading() {
			this.showPanel = true;
		},
	},
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: "Roboto", sans-serif;
}

::-webkit-scrollbar {
	width: 7px;

	&-track {
		background: #f1f1f1;
	}

	&-thumb {
		background: #888;

		&:hover {
			background: #555;
		}
	}
}

#app {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	display: grid;
	grid-template-rows: auto auto;
	grid-template-areas:
		"search"
		"content";
}

#search-bar {
	grid-area: "search";
	width: 100vw;
	height: 10vh;
}

#content {
	position: relative;
	width: 100vw;
	height: 90vh;
	grid-area: content;
	display: grid;
	grid-template-columns: 1fr;
	grid-template-areas: "map";

	#hover-panel {
		z-index: 1;
		position: absolute;
		height: 100%;
		width: auto;
		display: flex;

		#event-list {
			height: 100%;
			width: 400px;
		}

		.load-more-overlay {
			display: flex;
			flex-direction: column;
			position: absolute;
			align-items: center;
			justify-content: center;
			z-index: 99999;
			width: 400px;
			height: 100%;
			overflow: auto;
			background-color: rgba(0, 0, 0, 0.5);
		}

		.toggle-button {
			margin-top: 8px;
			width: 23px;
			height: 48px;
			background-color: rgba(255, 255, 255, 0.9);
			border: none;
			border-left: 1px solid #d4d4d4;
			box-shadow: 3px -1px 7px 0px rgba(0, 0, 0, 0.3);
			outline: none;

			&:hover {
				cursor: pointer;
			}
		}
	}

	#mapbox {
		grid-area: map;
	}
}

.slide-out-enter-active {
	animation: slide-out 0.25s ease-in-out reverse;
}

.slide-out-leave-active {
	animation: slide-out 0.25s ease-in-out;
}

@keyframes slide-out {
	0% {
		margin-left: 0%;
	}
	100% {
		margin-left: -100%;
	}
}

@media screen and (max-width: 960px) {
	#content {
		#hover-panel {
			#event-list,
			.load-more-overlay {
				width: 325px;
			}
		}
	}
}

@media screen and (max-width: 768px) {
	#content {
		#hover-panel {
			#event-list,
			.load-more-overlay {
				width: 250px;
			}
		}
	}
}

/* Small Screens */
@media screen and (max-width: 640px) {
	#content {
		#hover-panel {
			bottom: 0;
			width: 100%;
			height: 50%;
			flex-direction: column-reverse;

			#event-list {
				height: 100%;
				width: 100%;
			}

			.load-more-overlay {
				width: 100%;
				height: calc(100% - 21px);
			}

			.toggle-button {
				width: 100%;
				height: 23px;
				margin-top: 0px;
				border-bottom: 1px solid rgba(0, 0, 0, 0.25);
				box-shadow: 0px -5px 10px -2px rgba(0, 0, 0, 0.3);
			}
		}
	}

	@keyframes slide-out {
		0% {
			margin-bottom: 0;
		}
		100% {
			margin-bottom: -100%;
		}
	}
}
</style>
