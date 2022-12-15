<template>
	<div id="mapbox"></div>
</template>

<script>
import { mapState } from "vuex";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default {
	name: "Mapbox",
	data() {
		return {
			accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
			map: null,
			markers: [],
		};
	},
	mounted() {
		mapboxgl.accessToken = this.accessToken;

		this.map = new mapboxgl.Map({
			container: "mapbox",
			style: "mapbox://styles/mapbox/streets-v11",
			center: [-100.88415824784241, 39.860819332920386],
			zoom: 3,
		});

		this.map.addControl(new mapboxgl.NavigationControl(), "top-right");
		this.map.addControl(
			new mapboxgl.GeolocateControl({
				positionOptions: { enableHighAcuracy: true },
				trackUserLocation: true,
			})
		);

		if (this.events.length) {
			this.addMarkers();
		}
	},
	computed: {
		...mapState(["events", "previousItem", "activeItem", "markerIndex"]),
	},
	methods: {
		addMarkers() {
			if (this.markers.length) {
				for (let marker of this.markers) {
					marker.remove();
				}
			}

			let bounds = new mapboxgl.LngLatBounds();

			for (let [index, e] of this.events.entries()) {
				let popup = new mapboxgl.Popup({
					className: "marker-popup",
				}).setHTML(`<h1>${e.name}</h1>`);

				popup.on("open", () => {
					this.$store.commit("setActiveItem", index);
				});

				let marker = new mapboxgl.Marker()
					.setLngLat([
						parseFloat(e._embedded.venues[0].location.longitude),
						parseFloat(e._embedded.venues[0].location.latitude),
					])
					.setPopup(popup)
					.addTo(this.map);

				bounds.extend(marker.getLngLat());

				this.markers.push(marker);

				this.map.fitBounds(bounds, { padding: 50 });
			}
		},
	},
	watch: {
		events() {
			this.addMarkers();
		},
		markerIndex() {
			this.markers.forEach((e) => {
				if (e.getPopup().isOpen()) {
					e.togglePopup();
				}
			});

			let activeMarker = this.markers[this.markerIndex];

			activeMarker.togglePopup();
		},
	},
};
</script>

<style lang="scss">
#mapbox {
	.marker-popup {
		width: 300px;
		height: 100px;
	}

	.mapboxgl-canvas {
		outline: none;
	}
}
</style>
