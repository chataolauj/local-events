import { createApp } from "vue";
import Vuex from "vuex";
import ticketmaster from "../lib/ticketmaster";

const Vue = createApp({})
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		searchParams: {},
		loading: false,
		events: [],
		isEventsNull: true,
		maxPage: null,
		activeItem: null,
		markerIndex: null,
		loadingMore: false,
	},
	mutations: {
		setSearchParams(state, params) {
			state.searchParams = params;
		},
		setLoading(state, isLoading) {
			state.loading = isLoading;
		},
		setEvents(state, events) {
			state.events = events;
		},
		setIsEventsNull(state, isEventsNull) {
			state.isEventsNull = isEventsNull;
		},
		setMaxPage(state, pageNumber) {
			state.maxPage = pageNumber;
		},
		setActiveItem(state, index) {
			state.activeItem = index;
		},
		setMarkerIndex(state, index) {
			state.markerIndex = index;
		},
		setLoadingMore(state, isLoading) {
			state.loadingMore = isLoading;
		},
	},
	actions: {
		// eslint-disable-next-line
		filterEvents(context, events) {
			return new Promise((resolve, reject) => {
				if (!Array.isArray(events)) {
					reject("Invalid argument: is not of type Array.");
				}

				let filtered = events.filter((event) => {
					let now = new Date();
					let event_stop = new Date(event.stop_time);

					if (event_stop >= now || event_stop == null) {
						return event;
					}
				});

				resolve(filtered);
			});
		},
		getEvents({ state, commit }, coords) {
			commit("setLoading", true);
			commit("setActiveItem", null);
			commit("setMarkerIndex", null);
			//console.log(state.searchParams);

			let params = {
				coords,
				radius: "",
				date: "",
				pageNumber: 0,
			};

			commit("setSearchParams", params);
			//console.log(state.searchParams);

			ticketmaster
				.getEvents(params)
				.then(async (res) => {
					try {
						commit("setLoading", false);

						commit("setMaxPage", res.data.page.totalPages);

						commit("setEvents", res.data._embedded.events);

						state.events.length
							? commit("setIsEventsNull", false)
							: commit("setIsEventsNull", true);
					} catch (err) {
						console.error(err);
						commit("setLoading", false);
						commit("setIsEventsNull", true);
					}
				})
				.catch((err) => {
					console.log(err);
					commit("setLoading", false);
					commit("setIsEventsNull", true);
				});
		},
		async loadMoreEvents({ state, commit }) {
			commit("setLoadingMore", true);

			//console.log(this.state.searchParams.pageNumber);
			//console.log(this.state.maxPage);

			if (state.searchParams.pageNumber < state.maxPage) {
				await ticketmaster
					.loadMoreEvents()
					.then(async (res) => {
						state.events.push(...res.data._embedded.events);

						setTimeout(() => {
							commit("setLoadingMore", false);
						}, 2000);
					})
					.catch((err) => {
						console.log(err);

						setTimeout(() => {
							commit("setLoadingMore", false);
						}, 2000);
					});
			}

			commit("setLoadingMore", false);
		},
		setActive({ commit }, index) {
			commit("setActiveItem", index);
			commit("setMarkerIndex", index);
		},
	},
	getters: {},
});

export default store;
