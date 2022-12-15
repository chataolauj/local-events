<template>
	<div id="search-bar">
		<div id="autocomplete">
			<div class="search-container">
				<input
					class="search-input"
					v-model="location"
					@focus="isFocused = true"
					@blur="isFocused = false"
					type="text"
					placeholder="Search location"
					@keyup.enter="setCoords(acResults[0])"
					required
				/>
				<button
					v-if="this.location.length > 2"
					class="far fa-times-circle icon"
					@mousedown="clearLocation"
				></button>
				<button class="fa fa-search icon" @click="getEvents"></button>
			</div>
			<ul id="ac-list" v-show="isFocused && this.acResults.length">
				<li
					v-for="(location, index) in acResults"
					:item="location"
					:key="index"
					@mousedown="setCoords(location)"
				>
					{{ location.place_name }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { fwdGeo } from "../lib/mapbox.js";
//import ticketmaster from "../lib/ticketmaster";

export default {
	name: "Search",
	data() {
		return {
			location: "",
			coords: {},
			isFocused: false,
			isSelected: false,
			acResults: [],
			timeout: null,
		};
	},
	methods: {
		searchLocation() {
			if (this.timeout) {
				clearTimeout(this.timeout);
			}

			this.timeout = setTimeout(async () => {
				await fwdGeo(this.location)
					.then((res) => {
						this.acResults = res.body.features;
					})
					.catch((err) => {
						console.error(err);
					});
			}, 300);
		},
		setCoords(location) {
			this.coords = {
				lng: location.center[0],
				lat: location.center[1],
			};
			this.isSelected = true;
			this.acResults = [];
			this.getEvents();
		},
		clearLocation() {
			this.location = "";
			this.acResults = [];
		},
		getEvents() {
			this.$store.dispatch("getEvents", this.coords);
		},
	},
	watch: {
		location() {
			if (this.location.length > 2 && !this.isSelected) {
				this.searchLocation();
			} else {
				this.acResults = [];
				this.isSelected = false;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.css");

$primaryOne: #ff3b3f;
$primaryTwo: #51d0de;
$primaryThree: #e1e8f0;

#search-bar {
	background-color: $primaryOne;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;

	.search-container {
		position: relative;
		background-color: white;
		border: 1px solid white;
		border-radius: 5px;
		display: flex;
		flex-direction: row;
		align-items: center;

		&:hover,
		&:focus-within {
			box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.3);
			transition: 0.1s ease-in-out;
		}
	}

	#autocomplete {
		position: relative;
		width: 40%;
	}

	#ac-list {
		z-index: 1000;
		position: absolute;
		width: 100%;
		list-style: none;
		margin-top: 5px;
		color: black;
		background-color: white;
		border: 2px solid white;
		border-radius: 5px;
		box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.3);

		li {
			padding: 5px;

			&:last-child {
				border-bottom: none;
			}

			&:hover {
				cursor: pointer;
				color: white;
				background-color: rgba(0, 0, 0, 0.3);
				border-radius: 5px;
			}
		}
	}

	.search-input {
		width: 100%;
		padding: 5px;
		margin-left: 5px;
		outline: none;
		border: 2px solid white;
		border-radius: 5px;
	}

	.icon {
		//position: absolute;
		width: 30px;
		font-size: 17px;
		color: $primaryOne;
		background: none;
		outline: none;
		border: none;

		&:hover {
			cursor: pointer;
			color: $primaryTwo;
			transition: ease 0.1s;
		}
	}

	.fa-times-circle {
		right: 40px;
	}

	.fa-search {
		right: 10px;
	}
}
</style>
