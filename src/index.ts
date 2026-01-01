function isIPv4(ip: string): boolean {
	const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
	return ipv4Regex.test(ip);
}

function getIPv4FromHeaders(request: Request): string | null {
	const cfConnectingIp = request.headers.get("cf-connecting-ip");
	if (cfConnectingIp && isIPv4(cfConnectingIp)) {
		return cfConnectingIp;
	}

	const xForwardedFor = request.headers.get("x-forwarded-for");
	if (xForwardedFor) {
		const ips = xForwardedFor.split(",").map((ip) => ip.trim());
		for (const ip of ips) {
			if (isIPv4(ip)) {
				return ip;
			}
		}
	}

	return null;
}

export default {
	async fetch(request: Request): Promise<Response> {
		const cf = (request as any).cf;
		const clientIp = getIPv4FromHeaders(request);
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

		console.log("All geolocation data:", JSON.stringify(cf, null, 2));

		return new Response(JSON.stringify(geolocationData, null, 2), {
			headers: {
				"content-type": "application/json;charset=UTF-8",
			},
		});
	},
};
