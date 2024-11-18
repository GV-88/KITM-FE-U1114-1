//TODO: class syntax

import ajaxService from './ajaxService';
import storage from './storage';

// TheMealDB is a very uninteresting API service.
// Cannot take advantage of "list and lookup" approach, not even combining queries.
// Every endpoint gives the same data format regardless of size.
// The only different things are lists of categories, ingredients and areas.

const api = {
	searchMeals: async function (query) {
		return ajaxService(query);
	},
	getSingleMealDetails: async function (id) {
		let data = await storage.getMealDetails(id);
		if (data === null) {
			data = await ajaxService({ id: id });
			if (data?.meals) {
				storage.saveMealDetails(data.meals[0]);
			}
		}
		return data;
	},
};

export default api;
