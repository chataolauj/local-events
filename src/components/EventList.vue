<template>
	<div id="event-list" :class="{ 'no-scroll': loadingMore }">
		<h3
			class="no-results"
			v-if="!loading && !events.length && isEventsNull == null"
		>
			Search for a location or postal code to obtain results.
		</h3>
		<CircleLoader v-else-if="loading" :width="100" />
		<h3 class="no-results" v-else-if="!loading && isEventsNull">
			Could not find events based on the search criteria.
		</h3>
		<ul v-else>
			<li
				:class="{ active: index == activeItem }"
				@click="setActive(index)"
				v-for="(event, index) in events"
				:item="event"
				:key="index"
			>
				<h4>{{ event.name }}</h4>
				<p>
					<i class="fas fa-map-marker-alt"></i>
					{{ event._embedded.venues[0].address.line1 }},
					{{ event._embedded.venues[0].city.name }},
					{{ event._embedded.venues[0].state.stateCode }},
					{{ event._embedded.venues[0].postalCode }}
				</p>
				<p>
					<i class="fas fa-calendar"></i>
					{{
						formatDate(event.dates.start.dateTime)
					}}
				</p>
				<p>
					<i class="fas fa-clock"></i>
					{{
						formatTime(event.dates.start.dateTime)
					}}
				</p>
			</li>
			<button class="load-more-button" @click="loadMoreEvents()">
				Load More
			</button>
		</ul>
	</div>
</template>

<script>
import { mapState } from "vuex";
import CircleLoader from "./CircleLoader.vue";

export default {
	name: "EventList",
	components: {
		CircleLoader,
	},
	computed: {
		...mapState([
			"loading",
			"events",
			"isEventsNull",
			"activeItem",
			"loadingMore",
		]),
        
	},
	methods: {
		setActive(index) {
			this.$store.dispatch("setActive", index);
		},
		loadMoreEvents() {
			this.$store.dispatch("loadMoreEvents");
		},
        formatDate(eventDate) {
			let date = new Date(eventDate);
			return (
				date.getMonth() +
				1 +
				"/" +
				date.getDate() +
				"/" +
				date.getFullYear()
			);
		},
		formatTime(eventDate) {
			let date = new Date(eventDate);

			let hour = date.getHours();
			let minutes = date.getMinutes();
			let timezone = date
				.toLocaleString("en", { timeZoneName: "short" })
				.split(" ")
				.pop();

			return (
				(hour > 12 ? hour - 12 : hour == 0 ? 12 : hour) +
				":" +
				(minutes < 10 ? "0" + minutes : minutes) +
				(hour < 12 ? " a.m." : " p.m.") +
				" " +
				timezone
			);
		}
	}
};
</script>

<style lang="scss" scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.css");

$width: 100px;
$primaryOne: #ff3b3f;
$primaryTwo: #51d0de;
$primaryThree: #e1e8f0;

#event-list {
	overflow: auto;
	display: flex;
	height: 100%;
	position: relative;
	background: white;
	box-shadow: 5px 60px 15px 0px rgba(0, 0, 0, 0.3);

	.no-results {
		margin: auto;
		text-align: center;
		max-width: 90%;
	}

	ul {
		width: 100%;

		li {
			background-color: white;
			color: black;
			border-bottom: 1px solid rgba(0, 0, 0, 0.25);
			list-style: none;
			padding: 5px 15px 5px 15px;

			h4 {
				padding-top: 5px;
				margin-bottom: 20px;
			}

			p {
				padding-bottom: 5px;

				i {
					padding-right: 5px;
				}
			}

			.active {
				background-color: rgba(81, 208, 222, 0.5);
			}

			&:hover {
				cursor: pointer;
				background-color: $primaryThree;
				color: black;
			}
		}
	}

	.load-more-button {
		width: 100%;
		padding: 10px;
		background-color: $primaryOne;
		border: none;
		outline: none;
		font-size: 1.05em;

		&:hover {
			cursor: pointer;
		}
	}

	.active {
		background-color: rgba(81, 208, 222, 0.5);

		&:hover {
			background-color: rgba(81, 208, 222, 0.5);
		}
	}

	&.no-scroll {
		overflow: hidden;
	}
}
</style>
