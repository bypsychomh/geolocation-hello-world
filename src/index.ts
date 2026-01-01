
export default {
	async fetch(request: Request): Promise<Response> {
		const cf = (request as any).cf;
		const clientIp = cf?.requestMetadata?.clientIp || request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
		
		const geolocationData = {
			ip: clientIp,
			colo: cf?.colo,
			country: cf?.country,
			city: cf?.city,
			continent: cf?.continent,
			latitude: cf?.latitude,
			longitude: cf?.longitude,
			postalCode: cf?.postalCode,
			metroCode: cf?.metroCode,
			region: cf?.region,
			regionCode: cf?.regionCode,
			timezone: cf?.timezone,
		};

		console.log("All geolocation data:", JSON.stringify(geolocationData, null, 2));

		return new Response(JSON.stringify(geolocationData, null, 2), {
			headers: {
				"content-type": "application/json;charset=UTF-8",
			},
		});
	},
};
