const ENDPOINT = "https://v2.api.noroff.dev/square-eyes";

// fetches data from api
export async function fetchAll() {
	const response = await fetch(ENDPOINT);
	if (!response.ok) {
		throw new Error("Failed to load data");
	}
	const json = await response.json();
	if (!json || !Array.isArray(json.data)) {
		return [];
	}
	return json.data;
}

// fetches a single movie by ID
export async function fetchOne(id) {
	const response = await fetch(ENDPOINT + "/" + encodeURIComponent(id));
	if (!response.ok) {
		throw new Error("Movie not found");
	}
	const json = await response.json();
	return json.data || null;
}
