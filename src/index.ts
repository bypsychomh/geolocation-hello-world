
export default {
	async fetch(request: Request): Promise<Response> {
		const cf = (request as any).cf || {};

		// Copy all cf fields for full visibility.
		const cfAll: Record<string, unknown> = {};
		for (const key of Object.keys(cf)) {
			cfAll[key] = (cf as any)[key];
		}

		const clientIp =
			(cf as any)?.requestMetadata?.clientIp ||
			request.headers.get("CF-Connecting-IP") ||
			request.headers.get("X-Forwarded-For") ||
			"unknown";

		const geolocationData = {
			ip: clientIp,
			colo: (cf as any)?.colo,
			country: (cf as any)?.country,
			city: (cf as any)?.city,
			continent: (cf as any)?.continent,
			latitude: (cf as any)?.latitude,
			longitude: (cf as any)?.longitude,
			postalCode: (cf as any)?.postalCode,
			metroCode: (cf as any)?.metroCode,
			region: (cf as any)?.region,
			regionCode: (cf as any)?.regionCode,
			timezone: (cf as any)?.timezone,
		};

		const responsePayload = {
			geolocation: geolocationData,
			cfAll,
			cfKeys: Object.keys(cfAll).sort(),
		};

		console.log("CF keys:", JSON.stringify(responsePayload.cfKeys));
		console.log("CF all data:", JSON.stringify(cfAll, null, 2));
		console.log("Geolocation data:", JSON.stringify(geolocationData, null, 2));

		return new Response(JSON.stringify(responsePayload, null, 2), {
			headers: {
				"content-type": "application/json;charset=UTF-8",
			},
		});
	},
};
