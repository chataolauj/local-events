import geocoding from "@mapbox/mapbox-sdk/services/geocoding";

const geoService = geocoding({
	accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
});

export function fwdGeo(location) {
	return new Promise((resolve, reject) => {
		geoService
			.forwardGeocode({
				query: location,
				limit: 5,
				types: [
					"place",
					"region",
					"postcode",
					"country",
					"address",
					"locality",
					"district",
				],
			})
			.send()
			.then(
				(res) => {
					resolve(res);
				},
				(err) => {
					reject(err);
				}
			);
	});
}

export default {
	fwdGeo,
};
