import axios from "axios";
import store from "../store/index";
import geohash from "latlon-geohash";

//const proxy = "https://cors-anywhere.herokuapp.com/";
const TICKETMASTER_API_KEY = import.meta.env.VITE_TICKETMASTER_KEY;
const API_URL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}`;

function getEvents(searchParams) {
	let { coords, date, radius, pageNumber } = searchParams;

	let geoPoint = geohash.encode(coords.lat, coords.lng, 9);

	if (date == null || date == "") {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, "0");
		var mm = String(today.getMonth() + 1).padStart(2, "0");
		var yyyy = today.getFullYear();

		date = mm + "/" + dd + "/" + yyyy;
	}

	if (radius == null || radius == "") {
		radius = 25;
	}

	return axios.get(
		`${API_URL}&geoPoint=${geoPoint}&radius=${radius}&page=${pageNumber}`
	);
}

function loadMoreEvents() {
	let { coords, date, radius, pageNumber } = store.state.searchParams;

	let geoPoint = geohash.encode(coords.lat, coords.lng, 9);

	pageNumber++;

	if (radius == null || radius == "") {
		radius = 25;
	}

	store.commit("setSearchParams", { coords, date, radius, pageNumber });

	return axios.get(
		`${API_URL}&geoPoint=${geoPoint}&radius=${radius}&page=${pageNumber}`
	);
}

export default {
	getEvents,
	loadMoreEvents,
};
