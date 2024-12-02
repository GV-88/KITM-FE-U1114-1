class AjaxService {
	static queryParamsTranslation = {
		searchstring: 's',
		firstLetter: 'f',
		id: 'i',
		category: 'c',
		area: 'a',
		ingredient: 'i',
	};
	static validEndpoints = ['search', 'lookup', 'random', 'categories', 'list', 'filter'];

	static async get(endpoint, query) {
		try {
			if(!AjaxService.validEndpoints.includes(endpoint)) {
				throw new Error('invalid endpoint');
			}
			// eslint-disable-next-line no-undef
			const envStatus = process.env.STATUS; //TODO: learn to properly use .env with webpack
			const baseUrl =
				envStatus === 'dev' ? 'http://localhost' : 'https://www.themealdb.com';
			let url = new URL(baseUrl);
			
			if (envStatus === 'dev') {
				url.port = window.location.port;
				url.pathname = `/test_data/response_sample_${endpoint}${Object.keys(query ?? {}).length === 0 ? '' : '_' + AjaxService.queryParamsTranslation[(Object.keys(query))[0]] + '_' + Object.values(query)[0].toLowerCase()}.json`;
			}
			else {
				url.pathname = `/api/json/v1/1/${endpoint}.php`;
			}
			for (const key in query ?? {}) {
				url.searchParams.append(AjaxService.queryParamsTranslation[key], query[key]);
			}

			console.log(url.toString());

			const response = await fetch(url);
			if (
				response?.headers &&
				(response.headers.get('Content-Type') ?? '')
					.toLowerCase()
					.includes('application/json')
			) {
				return response.json();
			} else {
				throw new Error('unexpected content type');
			}
		} catch (error) {
			console.log(error);
			return { Response: false, Error: error };
		}
	}
}

export default AjaxService;
